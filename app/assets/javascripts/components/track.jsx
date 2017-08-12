import PropTypes from 'prop-types'

class Track extends React.Component {
  onAudioEnded() {
    if (this.props.onPause) {
      this.props.onPause()
    }
  }

  onSelect(event) {
    event.currentTarget.blur()
    if (this.props.onSelect) {
      this.props.onSelect()
    }
  }

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
    const trackIsSelectable = typeof this.props.onSelect === 'function'
    const imageClass = `track-image ${trackIsSelectable ? 'selectable' : ''}`

    const imageTag = (
      <img
        src={image.url}
        width={image.width}
        height={image.height}
        alt=""
        className={imageClass}
      />
    )

    if (this.includeAudio()) {
      return (
        <button
          type="button"
          className={`audio-toggle ${trackIsSelectable ? 'selectable' : ''}`}
          style={{ width: image.width }}
          onClick={e => this.toggleAudio(e)}
        >
          {imageTag}
          {this.statusIcon()}
        </button>
      )
    }

    return imageTag
  }

  statusIcon() {
    if (!this.audioTag || this.audioTag.paused) {
      return <i className="fa fa-play" aria-hidden="true" />
    }
    return <i className="fa fa-pause" aria-hidden="true" />
  }

  trackInfo() {
    const { name, artists } = this.props

    if (this.props.onSelect) {
      return (
        <button
          className="track-info with-tooltip with-tooltip-bottom"
          type="button"
          aria-label="Click to find songs like this"
          onClick={e => this.onSelect(e)}
        >
          <div className="track-name" title={name}>{name}</div>
          <div className="artist-names">
            {artists.map(artist => (
              <span key={artist.id} className="artist-name">
                {artist.name}
              </span>
            ))}
          </div>
        </button>
      )
    }

    return (
      <span className="track-info">
        <div className="track-name" title={name}>{name}</div>
        <div className="artist-names">
          {artists.map(artist => (
            <span key={artist.id} className="artist-name">
              {artist.name}
            </span>
          ))}
        </div>
      </span>
    )
  }

  render() {
    const { url, image, audioUrl, allowedToPlay, onSelect } = this.props
    const trackIsSelectable = typeof onSelect === 'function'

    return (
      <div className={`track-and-artists ${trackIsSelectable ? 'selectable' : ''}`}>
        {this.includeAudio() ? (
          <audio
            preload="metadata"
            src={audioUrl}
            onEnded={() => this.onAudioEnded()}
            ref={audioTag => this.audioTag = audioTag}
          />
        ) : ''}
        {this.hasImage() ? this.image() : ''}
        {this.trackInfo()}
      </div>
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
  allowedToPlay: PropTypes.bool,
  onSelect: PropTypes.func
}

export default Track
