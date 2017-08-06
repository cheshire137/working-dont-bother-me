import PropTypes from 'prop-types'

import Track from './track.jsx'

class TracksList extends React.Component {
  render() {
    const { tracks } = this.props

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
