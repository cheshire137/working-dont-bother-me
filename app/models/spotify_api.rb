class SpotifyAPI
  include HTTParty

  BASE_URI = 'https://api.spotify.com'
  API_VERSION = 'v1'
  PLAYLIST_NAME = "Working, Don't Bother Me"
  PLAYLIST_DESCRIPTION = 'Peaceful, ambient, and atmospheric tracks to work to.'

  base_uri BASE_URI

  def initialize(user)
    @user = user
  end

  # Returns a seed track and a list of recommended tracks that should be good to work to.
  def working_recommendations
    seed_track = sample_track
    tracks = working_recommendations_for(seed_track)
    while tracks.empty?
      seed_track = sample_track
      tracks = working_recommendations_for(seed_track)
    end
    full_seed_track = track_info(seed_track)[0]
    [full_seed_track, track_info(*tracks)]
  end

  def working_recommendations_for(seed_track)
    seed_tracks = []
    seed_tracks << seed_track if seed_track
    features = working_features
    min_features = working_feature_minimums
    max_features = working_feature_maximums
    recommendations(seed_tracks: seed_tracks, features: features, min_features: min_features,
                    max_features: max_features)
  end

  # https://developer.spotify.com/web-api/search-item/
  def search_tracks(query)
    q = CGI.escape(query)
    data = get("/search?q=#{q}&type=track")
    basic_tracks = data['tracks']['items']
    return basic_tracks if basic_tracks.empty?
    track_info(*basic_tracks)
  end

  # https://developer.spotify.com/web-api/web-api-personalization-endpoints/get-recently-played/
  def recently_played(limit: 10)
    Rails.cache.fetch("user/#{@user.id}/recently_played", expires_in: 1.hour) do
      data = get("/me/player/recently-played?limit=#{limit}")
      data['items']
    end
  end

  # https://developer.spotify.com/web-api/get-users-saved-tracks/
  def saved_tracks(limit: 10)
    Rails.cache.fetch("user/#{@user.id}/saved_tracks", expires_in: 1.hour) do
      data = get("/me/tracks?limit=#{limit}")
      data['items']
    end
  end

  def sample_track
    tracks = recently_played + saved_tracks
    tracks.sample['track']
  end

  def working_feature_minimums
    {
      # "Values above 0.5 are intended to represent instrumental tracks"
      instrumentalness: 0.8
    }
  end

  def working_feature_maximums
    {
      # "death metal has high energy, while a Bach prelude scores low on the scale"
      energy: 0.5,

      # "Values above 0.66 describe tracks that are probably made entirely of spoken words"
      speechiness: 0.3
    }
  end

  # Returns a hash of audio features, like acousticness and danceability,
  # with values conducive to focused work.
  def working_features
    {
      # "1.0 represents high confidence the track is acoustic"
      acousticness: feature_in_range(0.0, 1.0),

      # "death metal has high energy, while a Bach prelude scores low on the scale"
      energy: feature_in_range(0.0, 0.5),

      # "Values above 0.5 are intended to represent instrumental tracks"
      instrumentalness: feature_in_range(0.8, 1.0),

      # "Values above 0.66 describe tracks that are probably made entirely of spoken words"
      speechiness: feature_in_range(0.0, 0.3)
    }
  end

  # https://developer.spotify.com/web-api/get-recommendations/
  def recommendations(limit: 21, min_features: {}, seed_tracks: [], features: {}, max_features: {})
    path = "/recommendations?limit=#{limit + 5}"
    if seed_tracks.any?
      track_ids = seed_tracks.map { |track| track['id'] }.join(',')
      path += "&seed_tracks=#{track_ids}"
    end
    if features.any?
      features.each do |feature, value|
        path += "&target_#{feature}=#{value}"
      end
    end
    if min_features.any?
      min_features.each do |feature, value|
        path += "&min_#{feature}=#{value}"
      end
    end
    if max_features.any?
      max_features.each do |feature, value|
        path += "&max_#{feature}=#{value}"
      end
    end
    data = get(path)
    tracks = data['tracks'].uniq { |track| track['id'] }
    tracks[0...limit]
  end

  # https://developer.spotify.com/web-api/get-playlist/
  def get_playlist
    get("/users/#{@user.uid}/playlists/#{@user.playlist_id}")
  end

  # https://developer.spotify.com/web-api/create-playlist/
  def create_playlist
    url = "/#{API_VERSION}/users/#{@user.uid}/playlists"
    headers = default_headers('Content-Type' => 'application/json')
    body = { name: PLAYLIST_NAME, description: PLAYLIST_DESCRIPTION }
    Rails.logger.info "POST #{BASE_URI}#{url}"
    data = self.class.post(url, headers: headers, body: body.to_json).parsed_response
    raise SpotifyError, data['error']['message'] if data['error']
    data
  end

  # https://developer.spotify.com/web-api/replace-playlists-tracks/
  def replace_playlist_tracks(playlist_id, uris)
    url = "/#{API_VERSION}/users/#{@user.uid}/playlists/#{playlist_id}/tracks"
    headers = default_headers('Content-Type' => 'application/json')
    body = { uris: uris }.to_json
    Rails.logger.info "PUT #{BASE_URI}#{url}"
    data = self.class.put(url, headers: headers, body: body).parsed_response
    raise SpotifyError, data['error']['message'] if data['error']
    data
  end

  # https://developer.spotify.com/web-api/get-several-tracks/
  def track_info(*tracks)
    ids = tracks.map { |track| track['id'] }.join(',')
    data = get("/tracks/?ids=#{ids}")
    data['tracks']
  end

  private

  # Returns a Spotify audio feature within the given numeric range, formatted
  # to the precision the Spotify API expects.
  def feature_in_range(min, max)
    '%0.2f' % rand(min..max)
  end

  def default_headers(extra = {})
    extra.merge("Authorization" => "Bearer #{@user.token}")
  end

  def get(path)
    url = "/#{API_VERSION}#{path}"
    Rails.logger.info "GET #{BASE_URI}#{url}"
    data = self.class.get(url, headers: default_headers).parsed_response
    if data['error']
      if data['error']['status'] == 401
        data = update_tokens_and_retry(url)
      else
        raise SpotifyError, data['error']['message']
      end
    end
    data
  end

  def update_tokens_and_retry(url)
    unless @user.update_tokens
      raise 'Unable to fetch Spotify data at this time.'
    end

    data = self.class.get(url, headers: default_headers).parsed_response
    raise SpotifyError, data['error']['message'] if data['error']
    data
  end
end
