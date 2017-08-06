# Working, Don't Bother Me

Generate ambient, atmospheric, or peaceful Spotify playlists that you can work to.
The inspiration for this app comes from my desire to have new music that doesn't
distract me when I'm coding. It's jarring when I'm focused on a problem and the music
playing has an annoying segment, distracting lyrics, or otherwise something that
makes me hunt down my music player to change the track. The name of this app comes
from my manually curated
[Workin' Don't Bother Me](https://open.spotify.com/user/cheshire137/playlist/48qLKsZUHuMTiV8whluf4j)
playlist on Spotify.

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
