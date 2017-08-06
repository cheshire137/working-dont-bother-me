import PropTypes from 'prop-types'

const Track = function(props) {
  const { url, name, artists, image } = props
  const hasImage = typeof image !== 'undefined'

  return (
    <span className="track-and-artists">
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
        <span className="track-name" title={name}>{name}</span>
        <span className="artist-names">
          {artists.map(artist => (
            <span key={artist.id} className="artist-name">
              {artist.name}
            </span>
          ))}
        </span>
      </span>
    </span>
  )
}

Track.propTypes = {
  name: PropTypes.string.isRequired,
  artists: PropTypes.array.isRequired,
  image: PropTypes.object
}

export default Track
