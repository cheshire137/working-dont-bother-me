class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :registerable, :recoverable, :trackable,
  # and :omniauthable
  devise :database_authenticatable, :rememberable, :validatable

  devise :omniauthable, omniauth_providers: [:spotify]

  alias_attribute :to_s, :email

  def spotify_api
    SpotifyAPI.new(self)
  end

  # Returns true if the access token and refresh token are successfully updated.
  # Raises SpotifyError if something goes wrong connecting with Spotify.
  # Returns true if Spotify succeeds but the tokens can't be saved.
  def update_tokens
    if tokens = get_updated_tokens
      self.token = tokens['access_token']
      if (new_refresh_token = tokens['refresh_token']).present?
        self.refresh_token = new_refresh_token
      end
      save
    end
  end

  private

  def get_updated_tokens
    key = "#{ENV['SPOTIFY_CLIENT_ID']}:#{ENV['SPOTIFY_CLIENT_SECRET']}"
    grant = Base64.strict_encode64(key)

    uri = URI.parse('https://accounts.spotify.com/api/token')
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    headers = { 'Authorization' => "Basic #{grant}" }
    req = Net::HTTP::Post.new(uri.request_uri, headers)
    data = { 'grant_type' => 'refresh_token',
             'refresh_token' => refresh_token }
    req.set_form_data(data)

    res = http.request(req)
    if res.kind_of? Net::HTTPSuccess
      json = JSON.parse(res.body)
      json.slice('access_token', 'refresh_token')
    else
      raise SpotifyError, "Failed to refresh token: #{res.body}"
    end
  end
end
