import { Router, IndexRoute, Route, browserHistory } from 'react-router'

import AnonLayout from './anon-layout.jsx'
import AuthLayout from './auth-layout.jsx'
import LoginPage from './login-page.jsx'
import PlaylistPage from './playlist-page.jsx'
import NotFound from './not-found.jsx'

import WorkingAPI from '../models/working-api'
import LocalStorage from '../models/local-storage'

function setUser(json) {
  LocalStorage.set('email', json.email)
}

function forgetUser() {
  LocalStorage.delete('email')
}

function requireAuth(nextState, replace, callback) {
  const api = new WorkingAPI()

  api.getUser().then(json => {
    LocalStorage.set('authenticity-token', json.authenticityToken)

    if (json.auth) {
      setUser(json)
    } else {
      forgetUser()

      replace({
        pathname: '/',
        state: { nextPathname: nextState.location.pathname }
      })
    }
  }).then(callback)
}

function redirectIfSignedIn(nextState, replace, callback) {
  const newPath = `/user${nextState.location.pathname}`

  if (LocalStorage.has('email')) {
    const email = LocalStorage.get('email')
    if (email && email.length > 0) {
      replace({
        pathname: newPath,
        state: { nextPathname: nextState.location.pathname }
      })

      callback()
      return
    }
  }

  const api = new WorkingAPI()
  api.getUser().then(json => {
    LocalStorage.set('authenticity-token', json.authenticityToken)

    if (json.auth) {
      setUser(json)

      replace({
        pathname: newPath,
        state: { nextPathname: nextState.location.pathname }
      })
    } else {
      forgetUser()
    }
  }).then(callback)
}

const App = function() {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={AnonLayout} onEnter={redirectIfSignedIn}>
        <IndexRoute component={LoginPage} />
      </Route>
      <Route path="/user" component={AuthLayout} onEnter={requireAuth}>
        <IndexRoute component={PlaylistPage} />
      </Route>
      <Route path="*" component={NotFound} />
    </Router>
  )
}

export default App
