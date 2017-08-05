import PropTypes from 'prop-types'

import LocalStorage from '../models/local-storage'
import WorkingAPI from '../models/working-api'

import Track from './track.jsx'
import TracksList from './tracks-list.jsx'

class ProposedPlaylist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasPlaylist: LocalStorage.get('hasPlaylist')
    }
  }

  savePlaylist(event) {
    event.preventDefault()
    const uris = this.props.tracks.map(track => track.uri)
    const api = new WorkingAPI()
    api.savePlaylist(uris).then(playlist => this.onPlaylistSaved(playlist)).
      catch(err => this.onPlaylistError(err))
  }

  onPlaylistSaved(data) {
    this.setState({
      playlist: data.playlist,
      newPlaylist: !data.hadPlaylist,
      hasPlaylist: true
    })
  }

  onPlaylistError(error) {
    console.error('failed to save playlist', error)
  }

  render() {
    const { seedTrack, tracks } = this.props
    const { playlist, newPlaylist, hasPlaylist } = this.state
    const playlistSaved = typeof playlist !== 'undefined'

    return (
      <div className="content columns">
        <div className="column is-4 is-offset-2">
          <p><strong>Based on: </strong></p>
          <p><Track {...seedTrack} /></p>
          <hr />
          <p><strong>...here are some songs for you: </strong></p>
          <TracksList tracks={tracks} />
        </div>
        <div className="column has-text-centered">
          <p>Like the looks of it?</p>
          <form onSubmit={e => this.savePlaylist(e)}>
            <button type="submit" className="button is-primary is-large is-spotify">
              {hasPlaylist ? 'Update' : 'Create'} Playlist
            </button>
            {playlistSaved ? (
              <p className="help is-success">
                <span>Your playlist has been </span>
                <span>{newPlaylist ? 'created' : 'updated'}</span>
                <span> on Spotify!</span>
                <br />
                <a
                  href={playlist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >&ldquo;{playlist.name}&rdquo;</a>
              </p>
            ) : (
              <p className="help">
                {hasPlaylist ? (
                  <span>Your existing &ldquo;Working, Don't Bother Me&rdquo; playlist will be updated.</span>
                ) : (
                  <span>A new playlist will be created in your Spotify with these songs.</span>
                )}
              </p>
            )}
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
