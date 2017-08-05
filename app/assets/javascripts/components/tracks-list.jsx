import PropTypes from 'prop-types'

import Track from './track.jsx'

class TracksList extends React.Component {
  render() {
    const { tracks } = this.props

    return (
      <div>
        <p>
          <strong>{tracks.length} </strong>
          track{tracks.length === 1 ? '' : 's'}
        </p>
        <ul className="tracks-list">
          {tracks.map(track => (
            <li key={track.id}>
              <Track {...track} />
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

TracksList.propTypes = {
  tracks: PropTypes.array.isRequired
}

export default TracksList
