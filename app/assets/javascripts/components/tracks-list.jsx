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
    const { tracks, onSelect } = this.props
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
              onSelect={() => onSelect(track)}
            />
          </li>
        ))}
      </ul>
    )
  }
}

TracksList.propTypes = {
  tracks: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default TracksList
