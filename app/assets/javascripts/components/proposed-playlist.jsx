import PropTypes from 'prop-types'

import WorkingAPI from '../models/working-api'

import PlaylistForm from './playlist-form.jsx'
import SeedSelection from './seed-selection.jsx'
import Track from './track.jsx'
import TracksList from './tracks-list.jsx'

class ProposedPlaylist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onChangeSeed(newTrack) {
    this.setState({ seedIsDefault: false }, () => {
      this.props.onChangeSeed(newTrack)
    })
  }

  generatePlaylist(event) {
    event.currentTarget.blur()
    this.props.generatePlaylist()
  }

  render() {
    const { seedTrack, tracks, seedIsDefault, allowGeneration } = this.props

    return (
      <div className="content">
        <div className="columns">
          <div className="column is-6">
            <p><strong>Based on: </strong></p>
            <SeedSelection
              seedTrack={seedTrack}
              onChange={newTrack => this.onChangeSeed(newTrack)}
            />
            {seedIsDefault ? (
              <p className="help">
                You recently saved or played this song.
              </p>
            ) : ''}
          </div>
          <div className="column is-6">
            {tracks.length > 0 ? (
              <PlaylistForm
                tracks={tracks}
                disabled={!allowGeneration}
              />
            ) : ''}
          </div>
        </div>
        <div className="columns">
          <div className="column is-12">
            <div className="columns">
              <div className="column">
                <p><strong>...here are some songs for you: </strong></p>
              </div>
              <div className="column has-text-right">
                <button
                  type="button"
                  disabled={!allowGeneration}
                  className="is-small button is-transparent"
                  onClick={e => this.generatePlaylist(e)}
                ><i className={`fa fa-refresh ${allowGeneration ? '' : 'fa-spin'}`} aria-hidden="true" /></button>
              </div>
            </div>
            <TracksList
              tracks={tracks}
              onSelect={track => this.onChangeSeed(track)}
            />
          </div>
        </div>
      </div>
    )
  }
}

ProposedPlaylist.propTypes = {
  tracks: PropTypes.array.isRequired,
  seedTrack: PropTypes.object.isRequired,
  onChangeSeed: PropTypes.func.isRequired,
  seedIsDefault: PropTypes.bool,
  generatePlaylist: PropTypes.func.isRequired,
  allowGeneration: PropTypes.bool
}

export default ProposedPlaylist
