import WorkingAPI from '../models/working-api'

import Header from './header.jsx'
import ProposedPlaylist from './proposed-playlist.jsx'

class PlaylistPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { seedIsDefault: true }
  }

  componentDidMount() {
    const api = new WorkingAPI()
    api.generatePlaylist().
      then(data => this.onPlaylistGenerated(data)).
      catch(err => this.onPlaylistGenerationError(err))
  }

  onPlaylistGenerated(data) {
    this.setState({ tracks: data.tracks, seedTrack: data.seedTrack })
  }

  onPlaylistGenerationError(error) {
    console.error('failed to generate a playlist', error)
  }

  changeSeed(track) {
    this.setState({ tracks: null, seedIsDefault: false }, () => {
      const api = new WorkingAPI()
      api.generatePlaylist(track.id).
        then(data => this.onPlaylistGenerated(data)).
        catch(err => this.onPlaylistGenerationError(err))
    })
  }

  render() {
    const { tracks, seedTrack, seedIsDefault } = this.state
    const tracksLoaded = typeof tracks === 'object' && tracks

    return (
      <div>
        <Header title="Create Working Playlist" />
        <section className="section">
          <div className="container">
            {tracksLoaded ? (
              <ProposedPlaylist
                tracks={tracks}
                seedTrack={seedTrack}
                seedIsDefault={seedIsDefault}
                onChangeSeed={newTrack => this.changeSeed(newTrack)}
              />
            ) : (
              <h2
                className="title is-1 has-text-centered"
              >Finding some songs...</h2>
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
