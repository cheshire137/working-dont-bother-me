import PropTypes from 'prop-types'

import WorkingAPI from '../models/working-api'

import PlaylistForm from './playlist-form.jsx'
import SeedSelection from './seed-selection.jsx'
import Track from './track.jsx'
import TracksList from './tracks-list.jsx'

class ProposedPlaylist extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showRefreshTooltip: false }
  }

  onChangeSeed(newTrack) {
    this.props.onChangeSeed(newTrack)
  }

  generatePlaylist(event) {
    event.currentTarget.blur()
    this.props.generatePlaylist()
  }

  render() {
    const { seedTracks, tracks, allowGeneration } = this.props
    const { showRefreshTooltip } = this.state

    return (
      <div className="content">
        <div className="columns">
          <div className="column is-6">
            <p><strong>Based on: </strong></p>
            <SeedSelection
              seedTracks={seedTracks}
              onChange={newTrack => this.onChangeSeed(newTrack)}
            />
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
                <p><strong>Songs for your playlist:</strong></p>
              </div>
              <div className="column has-text-right">
                <div className="refresh-container">
                  <button
                    type="button"
                    disabled={!allowGeneration}
                    className="is-small button is-transparent with-tooltip with-tooltip-left"
                    onClick={e => this.generatePlaylist(e)}
                    aria-label="Find different songs"
                  >
                    <i className={`fa fa-refresh ${allowGeneration ? '' : 'fa-spin'}`} aria-hidden="true" />
                  </button>
                </div>
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
  seedTracks: PropTypes.array.isRequired,
  onChangeSeed: PropTypes.func.isRequired,
  generatePlaylist: PropTypes.func.isRequired,
  allowGeneration: PropTypes.bool
}

export default ProposedPlaylist
