class SpotifyController < ApplicationController
  before_action :require_login

  def search_tracks
    @tracks = api.search_tracks(params[:query])
  rescue SpotifyError => error
    render json: error, status: :failed_dependency
  end

  def generate_playlist
    if (track_id = params[:seed_track_id]).present?
      @seed_track = api.track_info('id' => track_id)[0]
      @tracks = api.working_recommendations_for(@seed_track)
      attempts = 1
      while attempts < 5 && @tracks.empty?
        @tracks = api.working_recommendations_for(@seed_track)
        attempts += 1
      end
    else
      @seed_track, @tracks = api.working_recommendations
    end
  rescue SpotifyError => error
    render json: error, status: :failed_dependency
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
  rescue SpotifyError => error
    render json: error, status: :failed_dependency
  end

  private

  def api
    @api ||= current_user.spotify_api
  end
end
