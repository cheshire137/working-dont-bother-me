import PropTypes from 'prop-types'

class Track extends React.Component {
  contents() {
    const { name, artists, image } = this.props
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

  render() {
    const { url } = this.props

    if (typeof url === 'string') {
      return (
        <a
          href={url}
          target="_blank"
          className="track-link"
          rel="noopener noreferrer"
        >{this.contents()}</a>
      )
    }

    return this.contents()
  }
}

Track.propTypes = {
  name: PropTypes.string.isRequired,
  artists: PropTypes.array.isRequired,
  image: PropTypes.object,
  url: PropTypes.string
}

export default Track
