class SpotifyAPI
  include HTTParty
  base_uri 'https://api.spotify.com'
  API_VERSION = "v1"

  def initialize(token, refresh_token)
    @token = token
    @refresh_token = refresh_token
    @options = { headers: { "Authorization" => "Bearer #{token}" } }
  end

  # Returns a seed track and a list of recommended tracks that should be good to work to.
  def working_recommendations
    seed_track, tracks = seed_track_and_recommendations
    while tracks.empty?
      seed_track, tracks = seed_track_and_recommendations
    end
    [seed_track, tracks]
  end

  # https://developer.spotify.com/web-api/web-api-personalization-endpoints/get-recently-played/
  def recently_played(limit: 10)
    Rails.cache.fetch("token/#{@token}/recently_played", expires_in: 1.hour) do
      data = get("/me/player/recently-played?limit=#{limit}")
      data['items']
    end
  end

  # https://developer.spotify.com/web-api/get-users-saved-tracks/
  def saved_tracks(limit: 10)
    Rails.cache.fetch("token/#{@token}/saved_tracks", expires_in: 1.hour) do
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
      instrumentalness: feature_in_range(0.7, 1.0),

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
    '%0.1f' % rand(min..max)
  end

  def get(path)
    puts "/#{API_VERSION}#{path}"
    self.class.get("/#{API_VERSION}#{path}", @options).parsed_response
  end
end
