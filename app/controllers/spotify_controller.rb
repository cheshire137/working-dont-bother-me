class SpotifyController < ApplicationController
  before_action :require_login

  def search_tracks
    @tracks = api.search_tracks(params[:query])
  rescue SpotifyError => error
    handle_exception error
  end

  def generate_playlist
    features_hash = get_features(SpotifyAPI::FEATURE_TARGETS)
    @features = SpotifyAPI.features_list(features_hash)
    if (track_id = params[:seed_track_id]).present?
      @seed_tracks = api.track_info('id' => track_id)
      if @seed_tracks.length > 0
        @tracks = api.working_recommendations_for(@seed_tracks[0], features: features_hash)
        attempts = 1
        while attempts < 5 && @tracks.empty?
          @tracks = api.working_recommendations_for(@seed_tracks[0], features: features_hash)
          attempts += 1
        end
        @seed_tracks = @seed_tracks.concat(api.sample_tracks).uniq { |track| track['id'] }
      else
        @tracks = []
      end
    else
      @seed_tracks, @tracks = api.working_recommendations(features: features_hash)
    end
  rescue SpotifyError => error
    handle_exception error
  end

  def save_playlist
    track_uris = params[:uris]
    return head :bad_request if track_uris.empty?
    @playlist = api.create_playlist
    api.replace_playlist_tracks(@playlist['id'], track_uris)
  rescue SpotifyError => error
    handle_exception error
  end

  private

  def get_features(default_features)
    features = default_features.dup
    features[:acousticness] = params[:acousticness].to_f if params[:acousticness]
    features[:energy] = params[:energy].to_f if params[:energy]
    features[:instrumentalness] = params[:instrumentalness].to_f if params[:instrumentalness]
    features[:speechiness] = params[:speechiness].to_f if params[:speechiness]
    features
  end

  def handle_exception(error)
    Rails.logger.error error.message
    Rails.logger.error error.backtrace.join("\n")
    render json: { error: error.message }, status: :failed_dependency
  end

  def api
    @api ||= current_user.spotify_api
  end
end
