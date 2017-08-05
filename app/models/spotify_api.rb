class SpotifyAPI
  include HTTParty
  base_uri 'https://api.spotify.com'
  API_VERSION = 'v1'
  PLAYLIST_NAME = "Working, Don't Bother Me"
  PLAYLIST_DESCRIPTION = 'Peaceful, ambient, and atmospheric tracks to work to.'

  def initialize(user)
    @user = user
  end

  # Returns a seed track and a list of recommended tracks that should be good to work to.
  def working_recommendations
    seed_track, tracks = seed_track_and_recommendations
    while tracks.empty?
      seed_track, tracks = seed_track_and_recommendations
    end
    [track_info(seed_track), track_info(tracks)]
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
  def recommendations(limit: 20, seed_tracks: [], features: {})
    path = "/recommendations?limit=#{limit}"
    if seed_tracks.any?
      track_ids = seed_tracks.map { |track| track['id'] }.join(',')
      path += "&seed_tracks=#{track_ids}"
    end
    if features.any?
      features.each do |feature, value|
        path += "&target_#{feature}=#{value}"
      end
    end
    data = get(path)
    data['tracks']
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
    data = self.class.post(url, headers: headers, body: body.to_json).parsed_response
    raise SpotifyError, data['error']['message'] if data['error']
    data
  end

  # https://developer.spotify.com/web-api/replace-playlists-tracks/
  def replace_playlist_tracks(playlist_id, uris)
    url = "/#{API_VERSION}/users/#{@user.uid}/playlists/#{playlist_id}/tracks"
    headers = default_headers('Content-Type' => 'application/json')
    body = { uris: uris }.to_json
    data = self.class.put(url, headers: headers, body: body).parsed_response
    raise SpotifyError, data['error']['message'] if data['error']
    data
  end

  # https://developer.spotify.com/web-api/get-several-tracks/
  def track_info(basic_tracks)
    basic_tracks = [basic_tracks] unless basic_tracks.is_a?(Array)
    ids = basic_tracks.map { |track| track['id'] }.join(',')
    data = get("/tracks/?ids=#{ids}")
    full_tracks = data['tracks']
    if basic_tracks.size == 1
      full_tracks[0]
    else
      full_tracks
    end
  end

  private

  # Returns a track that was used as a seed for recommendations, as well as a list of
  # recommended tracks from that seed.
  def seed_track_and_recommendations
    seed_track = sample_track
    seed_tracks = []
    seed_tracks << seed_track if seed_track
    features = working_features
    tracks = recommendations(seed_tracks: seed_tracks, features: features)
    [seed_track, tracks]
  end

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
