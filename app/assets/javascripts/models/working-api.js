import Fetcher from './fetcher'

export default class WorkingAPI extends Fetcher {
  constructor() {
    super('/api')

    const tokenMeta = document.querySelector('meta[name="csrf-token"]')
    this.token = tokenMeta.content

    this.defaultHeaders = {
      'X-CSRF-TOKEN': this.token,
      'Content-type': 'application/json'
    }
  }

  generatePlaylist(seedTrackID) {
    let path = '/generate-playlist'
    if (typeof seedTrackID === 'string' && seedTrackID.length > 0) {
      path += `?seed_track_id=${encodeURIComponent(seedTrackID)}`
    }
    return this.get(path, this.defaultHeaders)
  }

  searchTracks(query) {
    return this.get(`/search-tracks?query=${encodeURIComponent(query)}`,
                    this.defaultHeaders).then(json => json.tracks)
  }

  savePlaylist(uris) {
    return this.post('/save-playlist', this.defaultHeaders, { uris })
  }

  getUser() {
    return this.get('/user', this.defaultHeaders).
      then(json => json.user)
  }
}
