import PropTypes from 'prop-types'

import LocalStorage from '../models/local-storage'
import WorkingAPI from '../models/working-api'

class PlaylistForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasPlaylist: LocalStorage.get('hasPlaylist'),
      isSaving: false
    }
  }

  savePlaylist(event) {
    event.preventDefault()
    this.setState({ isSaving: true }, () => {
      const uris = this.props.tracks.map(track => track.uri)
      const api = new WorkingAPI()
      api.savePlaylist(uris).then(playlist => this.onPlaylistSaved(playlist)).
        catch(err => this.onPlaylistError(err))
    })
  }

  onPlaylistSaved(data) {
    this.setState({
      playlist: data.playlist,
      newPlaylist: !data.hadPlaylist,
      hasPlaylist: true,
      isSaving: false
    })
  }

  onPlaylistError(error) {
    console.error('failed to save playlist', error)
    this.setState({ isSaving: false })
  }

  render() {
    const { hasPlaylist, playlist, newPlaylist, isSaving } = this.state
    const playlistSaved = typeof playlist !== 'undefined'

    return (
      <div className="box has-text-centered">
        <p><strong>Like the looks of it?</strong></p>
        <form onSubmit={e => this.savePlaylist(e)}>
          <button
            type="submit"
            className="button is-primary is-large is-spotify"
            disabled={isSaving}
          >
            {hasPlaylist ? 'Update' : 'Create'} Playlist
          </button>
          {playlistSaved ? (
            <p className="help is-success">
              <span>Your playlist has been </span>
              <span>{newPlaylist ? 'created' : 'updated'}!</span>
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
    )
  }
}

PlaylistForm.propTypes = {
  tracks: PropTypes.array.isRequired
}

export default PlaylistForm
