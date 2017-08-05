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

  generatePlaylist() {
    return this.get('/generate-playlist', this.defaultHeaders)
  }

  savePlaylist(uris) {
    return this.post('/save-playlist', this.defaultHeaders, { uris })
  }

  getUser() {
    return this.get('/user', this.defaultHeaders).
      then(json => json.user)
  }
}
