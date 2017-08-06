import PropTypes from 'prop-types'

import Track from './track.jsx'

class TracksList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  allAudioStopped() {
    this.setState({ playingTrackID: null })
  }

  stopOtherAudio(trackID) {
    this.setState({ playingTrackID: trackID })
  }

  render() {
    const { tracks } = this.props
    const { playingTrackID } = this.state

    return (
      <ul className="tracks-list">
        {tracks.length < 1 ? (
          <li>
            <span>Could not find any similar songs that would be conducive to work.&nbsp;</span>
            <i className="fa fa-frown-o" aria-hidden="true" />
          </li>
        ) : ''}
        {tracks.map(track => (
          <li key={track.id}>
            <Track
              {...track}
              allowedToPlay={typeof playingTrackID !== 'string' || playingTrackID === track.id}
              onPlay={() => this.stopOtherAudio(track.id)}
              onPause={() => this.allAudioStopped()}
            />
          </li>
        ))}
      </ul>
    )
  }
}

TracksList.propTypes = {
  tracks: PropTypes.array.isRequired
}

export default TracksList
