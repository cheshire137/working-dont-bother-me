import LocalStorage from '../models/local-storage'

const LoginPage = function() {
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column has-text-centered is-6 is-offset-3">
            <h2 className="title is-2">
              Sign in to create playlists.
            </h2>
            <h3 className="subtitle is-4">
              Find atmospheric, ambient, and peaceful music
              that's good to work to.
            </h3>
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
