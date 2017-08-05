# Working, Don't Bother Me

Generate ambient, atmospheric, or peaceful Spotify playlists that you can work to.

## How to Develop

Create a [Spotify app](https://developer.spotify.com/my-applications/#!/applications/create).
Set `http://localhost:3000/users/auth/spotify/callback` as a redirect URI.

```bash
bundle install
npm install
rake db:setup
rails db:migrate
cp dotenv.sample .env
```

Modify .env with your Spotify app's credentials.

```bash
bundle exec rails s
open http://localhost:3000
```
