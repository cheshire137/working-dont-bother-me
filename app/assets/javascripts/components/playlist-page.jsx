import LocalStorage from '../models/local-storage'

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
      <section className="section">
        <div className="container">
          ayyy
        </div>
      </section>
    )
  }
}

PlaylistPage.propTypes = {
}

export default PlaylistPage
