import PropTypes from 'prop-types'

class PlaylistSettings extends React.Component {
  constructor(props) {
    super(props)
    this.state = { features: props.features }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ features: nextProps.features })
  }

  onFeatureChange(event, featureName) {
    const newFeatures = []
    for (let i = 0; i < this.state.features.length; i++) {
      const feature = {}
      for (let key in this.state.features[i]) {
        feature[key] = this.state.features[i][key]
      }
      if (feature.name === featureName) {
        feature.value = parseFloat(event.target.value)
      }
      newFeatures.push(feature)
    }
    this.setState({ features: newFeatures })
  }

  render() {
    const { close } = this.props
    const { features } = this.state

    return (
      <div className="modal is-active">
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Playlist Settings</p>
            <button
              className="delete"
              aria-label="close"
              onClick={() => close()}
            />
          </header>
          <section className="modal-card-body">
            {features.map(feature => (
              <div key={feature.name} className="field">
                <div className="control-label">
                  <label
                    className="label"
                    htmlFor={feature}
                  >{feature.label}</label>
                </div>
                <div className="field has-addons">
                  <span className="feature-range-min">0%</span>
                  <input
                    onChange={e => this.onFeatureChange(e, feature.name)}
                    id={feature.name}
                    value={feature.value}
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    className="slider"
                  />
                  <span className="feature-range-max">100%</span>
                  <span className="feature-percentage">
                    {Math.round(feature.value * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    )
  }
}

PlaylistSettings.propTypes = {
  close: PropTypes.func.isRequired,
  features: PropTypes.array.isRequired
}

export default PlaylistSettings
