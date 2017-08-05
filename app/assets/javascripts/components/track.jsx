import PropTypes from 'prop-types'

class Track extends React.Component {
  render() {
    const { name, artists, image, url } = this.props
    const hasImage = typeof image !== 'undefined'

    return (
      <span className="track-and-artists">
        <a
          href={url}
          target="_blank"
          className="track-link"
          rel="noopener noreferrer"
        >
          {hasImage ? (
            <img
              src={image.url}
              width={image.width}
              height={image.height}
              alt=""
              className="track-image"
            />
          ) : ''}
          <span className="track-info">
            <span className="track-name">{name}</span>
            <span className="artist-names">
              {artists.map(artist => (
                <span key={artist.id} className="artist-name">
                  {artist.name}
                </span>
              ))}
            </span>
          </span>
        </a>
      </span>
    )
  }
}

Track.propTypes = {
  name: PropTypes.string.isRequired,
  artists: PropTypes.array.isRequired,
  image: PropTypes.object,
  url: PropTypes.string.isRequired
}

export default Track
