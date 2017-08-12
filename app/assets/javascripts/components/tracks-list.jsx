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
    const chunkSize = 3
    const groups = tracks.map((track, i) => {
      if (i % chunkSize === 0) {
        return tracks.slice(i, i + chunkSize)
      }
    }).filter(track => track)

    return (
      <div>
        {tracks.length < 1 ? (
          <p>
            <span>Could not find any similar songs that would be conducive to work.&nbsp;</span>
            <i className="fa fa-frown-o" aria-hidden="true" />
          </p>
        ) : ''}
        {groups.map(tracksInGroup => (
          <div key={tracksInGroup.map(t => t.id).join(',')} className="columns is-desktop">
            {tracksInGroup.map(track => (
              <div className="column is-4-desktop is-12-tablet" key={track.id}>
                <Track
                  {...track}
                  allowedToPlay={typeof playingTrackID !== 'string' || playingTrackID === track.id}
                  onPlay={() => this.stopOtherAudio(track.id)}
                  onPause={() => this.allAudioStopped()}
                  onSelect={() => onSelect(track)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }
}

TracksList.propTypes = {
  tracks: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default TracksList
