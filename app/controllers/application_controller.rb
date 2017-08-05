class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  protected

  def require_login
    head :unauthorized unless user_signed_in?
  end
end
