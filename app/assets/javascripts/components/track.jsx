import PropTypes from 'prop-types'

class Track extends React.Component {
  toggleAudio(event) {
    event.currentTarget.blur()
    if (this.audioTag.paused) {
      if (this.props.onPlay) {
        this.props.onPlay()
      }
      this.audioTag.play()
    } else {
      if (this.props.onPause) {
        this.props.onPause()
      }
      this.audioTag.pause()
    }
  }

  includeAudio() {
    return this.props.allowedToPlay && typeof this.props.audioUrl === 'string'
  }

  hasImage() {
    return typeof this.props.image !== 'undefined'
  }

  image() {
    const { image } = this.props

    const imageTag = (
      <img
        src={image.url}
        width={image.width}
        height={image.height}
        alt=""
        className="track-image"
      />
    )

    if (this.includeAudio()) {
      return (
        <button
          type="button"
          className="audio-toggle"
          onClick={e => this.toggleAudio(e)}
        >{imageTag}</button>
      )
    }

    return imageTag
  }

  render() {
    const { url, name, artists, image, audioUrl, allowedToPlay } = this.props

    return (
      <span className="track-and-artists">
        {this.includeAudio() ? (
          <audio
            preload="metadata"
            src={audioUrl}
            ref={audioTag => this.audioTag = audioTag}
          />
        ) : ''}
        {this.hasImage() ? this.image() : ''}
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
}

Track.propTypes = {
  name: PropTypes.string.isRequired,
  artists: PropTypes.array.isRequired,
  image: PropTypes.object,
  audioUrl: PropTypes.string,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  allowedToPlay: PropTypes.bool
}

export default Track
