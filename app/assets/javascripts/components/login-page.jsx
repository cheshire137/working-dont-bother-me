import LocalStorage from '../models/local-storage'

const LoginPage = function() {
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-4 is-offset-4">
            <a
              href="/users/auth/spotify"
              className="button is-large is-spotify"
            >Sign in with Spotify</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
