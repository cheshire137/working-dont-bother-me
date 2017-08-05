import LocalStorage from '../models/local-storage'

import Header from './header.jsx'

class PlaylistPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticityToken: LocalStorage.get('authenticity-token')
    }
  }

  render() {
    const { authenticityToken } = this.state

    return (
      <div>
        <Header title="Create Working Playlist" />
        <section className="section">
          <div className="container">
            ayyy
          </div>
        </section>
      </div>
    )
  }
}

PlaylistPage.propTypes = {
}

export default PlaylistPage
