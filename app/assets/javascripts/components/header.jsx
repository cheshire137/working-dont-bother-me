import PropTypes from 'prop-types'

import LocalStorage from '../models/local-storage'

const Header = function(props) {
  const { title } = props
  const email = LocalStorage.get('email')
  const authenticityToken = LocalStorage.get('authenticity-token')

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-left">
          <a
            className="nav-item is-brand"
            href="/"
          >Working, Don't Bother Me</a>
        </div>
        <div className="nav-right">
          <span
            className="nav-item"
          >{email}</span>
          <form
            className="nav-item"
            action="/users/sign_out"
            method="post"
          >
            <input name="_method" type="hidden" value="delete" />
            <input name="authenticity_token" type="hidden" value={authenticityToken} />
            <button
              className="button"
              type="submit"
              onClick={() => LocalStorage.delete('email')}
            >Sign out</button>
          </form>
        </div>
      </div>
    </nav>
  )
}

Header.propTypes = {
  title: PropTypes.string
}

export default Header
