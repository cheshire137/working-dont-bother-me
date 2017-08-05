import PropTypes from 'prop-types'

import WorkingAPI from '../models/working-api'

import Track from './track.jsx'
import TracksList from './tracks-list.jsx'

class ProposedPlaylist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  savePlaylist(event) {
    event.preventDefault()
    const uris = this.props.tracks.map(track => track.uri)
    const api = new WorkingAPI()
    api.savePlaylist(uris).then(playlist => this.onPlaylistSaved(playlist)).
      catch(err => this.onPlaylistError(err))
  }

  onPlaylistSaved(playlist) {
    this.setState({ playlist })
  }

  onPlaylistError(error) {
    console.error('failed to save playlist', error)
  }

  render() {
    const { seedTrack, tracks } = this.props
    const { playlist } = this.state
    const playlistSaved = typeof playlist !== 'undefined'

    return (
      <div className="content columns">
        <div className="column">
          <p>
            <strong>Based on </strong> <Track {...seedTrack} />
          </p>
          <TracksList tracks={tracks} />
        </div>
        <div className="column">
          <p>Like the looks of it?</p>
          <form onSubmit={e => this.savePlaylist(e)}>
            <button type="submit" className="button is-primary is-large is-spotify">
              Save Playlist
            </button>
            {playlistSaved ? (
              <p className="help is-success">
                Your playlist has been created on Spotify!
                <a
                  href={playlist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >{playlist.name}</a>
              </p>
            ) : ''}
          </form>
        </div>
      </div>
    )
  }
}

ProposedPlaylist.propTypes = {
  tracks: PropTypes.array.isRequired,
  seedTrack: PropTypes.object.isRequired
}

export default ProposedPlaylist
