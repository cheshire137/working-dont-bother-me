import PropTypes from 'prop-types'

import WorkingAPI from '../models/working-api'

import PlaylistForm from './playlist-form.jsx'
import SeedSelection from './seed-selection.jsx'
import Track from './track.jsx'
import TracksList from './tracks-list.jsx'

class ProposedPlaylist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onChangeSeed(newTrack) {
    this.setState({ seedIsDefault: false }, () => {
      this.props.onChangeSeed(newTrack)
    })
  }

  render() {
    const { seedTrack, tracks, seedIsDefault } = this.props
    const { playlist, newPlaylist } = this.state

    return (
      <div className="content">
        <div className="columns">
          <div className="column is-5 is-offset-1">
            <p><strong>Based on: </strong></p>
            <SeedSelection
              seedTrack={seedTrack}
              onChange={newTrack => this.onChangeSeed(newTrack)}
            />
            {seedIsDefault ? (
              <p className="help">
                You recently saved or played this song.
              </p>
            ) : ''}
          </div>
          <div className="column is-5">
            {tracks.length > 0 ? (
              <PlaylistForm
                playlist={playlist}
                newPlaylist={newPlaylist}
                tracks={tracks}
              />
            ) : ''}
          </div>
        </div>
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <p><strong>...here are some songs for you: </strong></p>
            <TracksList tracks={tracks} />
          </div>
        </div>
      </div>
    )
  }
}

ProposedPlaylist.propTypes = {
  tracks: PropTypes.array.isRequired,
  seedTrack: PropTypes.object.isRequired,
  onChangeSeed: PropTypes.func.isRequired,
  seedIsDefault: PropTypes.bool
}

export default ProposedPlaylist
