import PropTypes from 'prop-types'

class Track extends React.Component {
  render() {
    const { name, artists } = this.props

    return (
      <span className="track-and-artists">
        <span className="track-name">{name}</span>
        <span> by </span>
        <span className="artist-names">
          {artists.map(artist => (
            <span key={artist.id} className="artist-name">
              {artist.name}
            </span>
          ))}
        </span>
      </span>
    )
  }
}

Track.propTypes = {
  name: PropTypes.string.isRequired,
  artists: PropTypes.array.isRequired
}

export default Track
