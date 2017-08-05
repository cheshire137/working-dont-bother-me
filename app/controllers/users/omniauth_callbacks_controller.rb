class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def spotify
    auth = request.env['omniauth.auth']
    user = User.where(email: auth.info.email).first_or_initialize
    credentials = auth.credentials
    user.token = credentials.token
    user.refresh_token = credentials.refresh_token
    user.password ||= Devise.friendly_token[0,20]
    user.save
    sign_in_and_redirect(user, event: :authentication)
  end

  def failure
    redirect_to root_path
  end
end
