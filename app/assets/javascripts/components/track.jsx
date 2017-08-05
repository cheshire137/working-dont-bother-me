import PropTypes from 'prop-types'

class Track extends React.Component {
  render() {
    const { name, artists, image } = this.props
    const hasImage = typeof image !== 'undefined'

    return (
      <span className="track-and-artists">
        {hasImage ? (
          <img
            src={image.url}
            width={image.width}
            alt=""
            className="track-image"
          />
        ) : ''}
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
  artists: PropTypes.array.isRequired,
  image: PropTypes.object
}

export default Track
