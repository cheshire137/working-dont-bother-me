import LocalStorage from '../models/local-storage'
import WorkingAPI from '../models/working-api'

import Header from './header.jsx'

class PlaylistPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticityToken: LocalStorage.get('authenticity-token')
    }
  }

  componentDidMount() {
    const api = new WorkingAPI()
    api.generatePlaylist().
      then(tracks => this.onPlaylistGenerated(tracks)).
      catch(err => this.onPlaylistGenerationError(err))
  }

  onPlaylistGenerated(data) {
    console.log(data)
    this.setState({ tracks: data.tracks })
  }

  onPlaylistGenerationError(error) {
    console.error('failed to generate a playlist', error)
  }

  tracksList() {
    const { tracks } = this.state

    if (typeof tracks === 'undefined') {
      return <p>Loading...</p>
    }

    return (
      <ul>
        {tracks.map(track => (
          <li key={track.id}>
            <span className="track-name">{track.name}</span>
            <span> by </span>
            {track.artists.map(artist => (
              <span key={artist.id} className="artist-name">
                {artist.name}
              </span>
            ))}
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const { authenticityToken } = this.state

    return (
      <div>
        <Header title="Create Working Playlist" />
        <section className="section">
          <div className="container">
            {this.tracksList()}
          </div>
        </section>
      </div>
    )
  }
}

PlaylistPage.propTypes = {
}

export default PlaylistPage
