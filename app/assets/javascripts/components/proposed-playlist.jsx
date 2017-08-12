import PropTypes from 'prop-types'

import WorkingAPI from '../models/working-api'

import PlaylistForm from './playlist-form.jsx'
import PlaylistSettings from './playlist-settings.jsx'
import SeedSelection from './seed-selection.jsx'
import Track from './track.jsx'
import TracksList from './tracks-list.jsx'

class ProposedPlaylist extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showSettings: false }
  }

  onChangeSeed(newTrack) {
    this.props.onChangeSeed(newTrack)
  }

  closeSettings() {
    this.setState({ showSettings: false })
  }

  generatePlaylist(event) {
    event.currentTarget.blur()
    this.props.generatePlaylist()
  }

  openSettings(event) {
    event.currentTarget.blur()
    this.setState({ showSettings: true })
  }

  render() {
    const { seedTracks, tracks, allowGeneration, features } = this.props
    const { showSettings } = this.state

    return (
      <div>
        <div className="columns content">
          <div className="column is-6">
            <p className="clearfix">
              <button
                type="button"
                onClick={e => this.openSettings(e)}
                className="pull-right button is-small is-transparent with-tooltip with-tooltip-left"
                aria-label="Change playlist settings"
              ><i className="fa fa-cog" aria-hidden="true" /></button>
              <strong>Based on:</strong>
            </p>
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
        <div className="columns content">
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
        {showSettings ? (
          <PlaylistSettings
            features={features}
            close={() => this.closeSettings()}
          />
        ) : ''}
      </div>
    )
  }
}

ProposedPlaylist.propTypes = {
  tracks: PropTypes.array.isRequired,
  seedTracks: PropTypes.array.isRequired,
  onChangeSeed: PropTypes.func.isRequired,
  generatePlaylist: PropTypes.func.isRequired,
  features: PropTypes.array.isRequired,
  allowGeneration: PropTypes.bool
}

export default ProposedPlaylist
