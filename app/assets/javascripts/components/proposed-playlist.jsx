import PropTypes from 'prop-types'

import Track from './track.jsx'
import TracksList from './tracks-list.jsx'

class ProposedPlaylist extends React.Component {
  render() {
    const { seedTrack, tracks } = this.props

    return (
      <div className="content">
        <p>
          <strong>Based on </strong> <Track {...seedTrack} />
        </p>
        <TracksList tracks={tracks} />
      </div>
    )
  }
}

ProposedPlaylist.propTypes = {
  tracks: PropTypes.array.isRequired,
  seedTrack: PropTypes.object.isRequired
}

export default ProposedPlaylist
