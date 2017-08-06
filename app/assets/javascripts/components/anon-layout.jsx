import PropTypes from 'prop-types'

import Footer from './footer.jsx'

const AnonLayout = function(props) {
  return (
    <div className="layout-container">
      <div className="layout-children-container">
        <nav className="nav">
          <div className="container">
            <div className="nav-left">
              <a
                className="nav-item is-brand"
                href="/"
              >Working, Don't Bother Me</a>
            </div>
          </div>
        </nav>
        {props.children}
      </div>
      <Footer />
    </div>
  )
}

AnonLayout.propTypes = {
  children: PropTypes.object.isRequired
}

export default AnonLayout
