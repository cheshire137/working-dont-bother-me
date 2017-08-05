import LocalStorage from '../models/local-storage'
import WorkingAPI from '../models/working-api'

import Header from './header.jsx'
import ProposedPlaylist from './proposed-playlist.jsx'

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
    this.setState({ tracks: data.tracks, seedTrack: data.seedTrack })
  }

  onPlaylistGenerationError(error) {
    console.error('failed to generate a playlist', error)
  }

  render() {
    const { tracks, seedTrack } = this.state
    const tracksLoaded = typeof tracks !== 'undefined'

    return (
      <div>
        <Header title="Create Working Playlist" />
        <section className="section">
          <div className="container">
            {tracksLoaded ? (
              <ProposedPlaylist
                tracks={tracks}
                seedTrack={seedTrack}
              />
            ) : (
              <p>Finding some songs...</p>
            )}
          </div>
        </section>
      </div>
    )
  }
}

PlaylistPage.propTypes = {
}

export default PlaylistPage
