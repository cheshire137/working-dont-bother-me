class SpotifyController < ApplicationController
  before_action :require_login

  def generate_playlist
    api = current_user.spotify_api
    @seed_track, @tracks = api.working_recommendations
  end
end
