import PropTypes from 'prop-types'
import onClickOutside from 'react-onclickoutside'

import LocalStorage from '../models/local-storage'
import WorkingAPI from '../models/working-api'

import Track from './track.jsx'
import TracksList from './tracks-list.jsx'

class SeedSelection extends React.Component {
  constructor(props) {
    super(props)
    this.state = { expanded: false, query: '', isSearching: false }
  }

  onChange(event) {
    this.setState({ query: event.target.value })
  }

  onKeyDown(event) {
    if (event.keyCode === 27) { // Esc
      this.setState({ expanded: false, query: '' })
    } else if (event.keyCode === 13) { // Enter
      const query = this.state.query.trim()
      if (query.length > 0) {
        this.searchForTrack(query)
      }
    }
  }

  onSearchResults(tracks) {
    this.setState({ expanded: true, tracks, isSearching: false }, () => {
      this.searchInput.focus()
    })
  }

  onSearchError(error) {
    console.error('failed to search tracks', error)
    this.setState({ isSearching: false })
  }

  chooseSeed(event, track) {
    event.currentTarget.blur()
    this.setState({ expanded: false })
    this.props.onChange(track)
  }

  handleClickOutside() {
    if (this.state.expanded) {
      this.setState({ expanded: false })
    }
  }

  searchForTrack(query) {
    this.setState({ isSearching: true }, () => {
      const api = new WorkingAPI()
      api.searchTracks(query).then(tracks => this.onSearchResults(tracks)).
        catch(err => this.onSearchError(err))
    })
  }

  submitSearch(event) {
    event.currentTarget.blur()
    this.searchForTrack(this.state.query)
  }

  toggle(event) {
    event.currentTarget.blur()
    this.setState({ expanded: !this.state.expanded }, () => {
      if (this.state.expanded) {
        this.searchInput.focus()
      }
    })
  }

  dropdownContent() {
    const { query, tracks, isSearching } = this.state
    const haveResults = tracks && tracks.length > 0
    const haveQuery = typeof query === 'string' && query.trim().length > 0

    return (
      <div className="dropdown-content">
        <div className="field has-addons">
          <div className="control is-expanded has-icons-left">
            <input
              type="text"
              placeholder="Search for a song"
              className="input"
              onKeyDown={e => this.onKeyDown(e)}
              onChange={e => this.onChange(e)}
              value={query}
              disabled={isSearching}
              ref={input => this.searchInput = input}
            />
            <span className="icon is-left">
              <i
                className={`fa ${isSearching ? 'fa-spin fa-refresh' : 'fa-search'}`}
                aria-hidden="true"
              />
            </span>
          </div>
          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={e => this.submitSearch(e)}
              disabled={!haveQuery || isSearching}
            >Search</button>
          </div>
        </div>
        {haveResults ? (
          <div>
            {tracks.map(track => (
              <button
                type="button"
                key={track.id}
                className="dropdown-item"
                onClick={e => this.chooseSeed(e, track)}
              ><Track {...track} /></button>
            ))}
          </div>
        ) : ''}
      </div>
    )
  }

  render() {
    const { seedTrack } = this.props
    const dropdownClasses = ['dropdown']
    if (this.state.expanded) {
      dropdownClasses.push('is-active')
    }

    return (
      <div className={dropdownClasses.join(' ')}>
        <div className="dropdown-trigger">
          <button
            onClick={e => this.toggle(e)}
            type="button"
            className="button track-button with-tooltip with-tooltip-top"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            aria-label="Your playlist is based off of this song"
          >
            <Track {...seedTrack} />
            <span className="icon is-small">
              <i className="fa fa-angle-down" aria-hidden="true" />
            </span>
          </button>
        </div>
        <div className="dropdown-menu" role="menu">
          {this.dropdownContent()}
        </div>
      </div>
    )
  }
}

SeedSelection.propTypes = {
  seedTrack: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default process.env.NODE_ENV === 'test' ? SeedSelection : onClickOutside(SeedSelection)
