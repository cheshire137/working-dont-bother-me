class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def spotify
    auth = request.env['omniauth.auth']
    user = User.where(uid: auth.uid).first_or_initialize
    user.email = auth.info.email
    credentials = auth.credentials
    user.token = credentials.token
    user.refresh_token = credentials.refresh_token
    user.password ||= Devise.friendly_token[0,20]

    if user.save
      sign_in_and_redirect(user, event: :authentication)
    else
      error = "Failed to sign in with Spotify: #{user.errors.full_messages.join(', ')}"
      render text: error, status: :unprocessable_entity
    end
  end

  def failure
    redirect_to root_path
  end
end
