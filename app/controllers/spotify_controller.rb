class SpotifyController < ApplicationController
  before_action :require_login

  def generate_playlist
    @seed_track, @tracks = api.working_recommendations
  end

  def save_playlist
    track_uris = params[:uris]
    return head :bad_request if track_uris.empty?
    @user_had_playlist = current_user.has_playlist?
    @playlist = if @user_had_playlist
      api.get_playlist
    else
      api.create_playlist
    end
    current_user.playlist_id = @playlist['id']
    current_user.save
    api.replace_playlist_tracks(current_user.playlist_id, track_uris)
  end

  private

  def api
    @api ||= current_user.spotify_api
  end
end
