class SpotifyController < ApplicationController
  before_action :require_login

  def generate_playlist
    api = current_user.spotify_api
    @seed_track = api.sample_track
    features = api.working_features
    @tracks = api.recommendations(seed_tracks: [@seed_track], features: features)
  end
end
