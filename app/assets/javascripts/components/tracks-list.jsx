import PropTypes from 'prop-types'

import Track from './track.jsx'

class TracksList extends React.Component {
  render() {
    const { tracks } = this.props

    return (
      <ul className="tracks-list">
        {tracks.map(track => (
          <li key={track.id}>
            <Track {...track} />
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
