Rails.application.routes.draw do
  devise_for :users, controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks',
    sessions: 'users/sessions'
  }

  scope defaults: { format: :json }, path: '/api' do
    get '/user' => 'users#current', as: :current_user
    get '/generate-playlist' => 'spotify#generate_playlist', as: :generate_playlist
    post '/save-playlist' => 'spotify#save_playlist', as: :save_playlist
    get '/search-tracks' => 'spotify#search_tracks', as: :search_tracks
  end

  root to: 'home#index'

  # Catch-all route so React can handle routing
  get '*path' => 'home#index'
end
