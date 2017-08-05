class SpotifyController < ApplicationController
  before_action :require_login

  def generate_playlist
    @seed_track, @tracks = api.working_recommendations
  end

  def save_playlist
    track_uris = params[:uris]
    return head :bad_request if track_uris.empty?

    @playlist = api.create_playlist
    api.add_tracks_to_playlist(@playlist['id'], track_uris)
  end

  private

  def api
    @api ||= current_user.spotify_api
  end
end
