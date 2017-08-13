import WorkingAPI from '../models/working-api'

import Header from './header.jsx'
import ProposedPlaylist from './proposed-playlist.jsx'

class PlaylistPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isGenerating: false }
  }

  componentDidMount() {
    this.generatePlaylist()
  }

  onPlaylistGenerated(data) {
    this.setState({
      tracks: data.tracks,
      seedTracks: data.seedTracks,
      isGenerating: false,
      features: data.features
    })
  }

  onPlaylistGenerationError(error) {
    console.error('failed to generate a playlist', error)
    this.setState({ isGenerating: false })
  }

  changeSeed(track) {
    this.generatePlaylist(track.id)
  }

  changeFeatures(featuresList) {
    const featuresHash = {}
    for (let feature of featuresList) {
      featuresHash[feature.name] = feature.value
    }
    const seedTrack = this.state.seedTracks[0]
    this.generatePlaylist(seedTrack.id, featuresHash)
  }

  generatePlaylist(trackID, features) {
    this.setState({ isGenerating: true, tracks: null }, () => {
      const api = new WorkingAPI()
      api.generatePlaylist(trackID, features).
        then(data => this.onPlaylistGenerated(data)).
        catch(err => this.onPlaylistGenerationError(err))
    })
  }

  render() {
    const { tracks, seedTracks, isGenerating, features } = this.state
    const tracksLoaded = typeof tracks === 'object' && tracks

    return (
      <div>
        <Header title="Create Working Playlist" />
        <section className="section">
          <div className="container">
            {tracksLoaded ? (
              <ProposedPlaylist
                tracks={tracks}
                features={features}
                seedTracks={seedTracks}
                onChangeSeed={newTrack => this.changeSeed(newTrack)}
                onChangeFeatures={newFeatures => this.changeFeatures(newFeatures)}
                generatePlaylist={() => this.generatePlaylist(seedTracks[0].id)}
                allowGeneration={!isGenerating}
              />
            ) : (
              <h2
                className="title is-1 has-text-centered"
              >Finding some songs...</h2>
            )}
          </div>
        </section>
      </div>
    )
  }
}

PlaylistPage.propTypes = {
}

export default PlaylistPage
