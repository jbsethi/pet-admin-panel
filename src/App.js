import React from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';

import useToken from './useToken';
import useRole from './useRole';
import useToaster from './useToaster';

import Toaster from './components/Toaster.js'

import './scss/style.scss';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));

const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

export const AppContext = React.createContext()

const App = () => {
  const {token, setToken} = useToken()
  const {role, setRole} = useRole()
  const {toasts, addToast} = useToaster()

  React.useEffect(() => {
    const tokenExpiryTime = localStorage.getItem('tokenExpiry')
   

    const currentTime = new Date().getTime()

    console.log(tokenExpiryTime, currentTime.toString().slice(0, 10))
    if (+(currentTime.toString().slice(0, 10)) > +tokenExpiryTime) {
      console.log('did it loggout out here !')
      setToken(null)
      setRole(null)
    }
  }, [])

  return (
    <AppContext.Provider value={{ role, setToken, setRole, addToast }}>
      <HashRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route exact path="/login" name="Login Page" render={props => {
              if (token) {
                return <Redirect to="/"/>
              } else {
                return <Login {...props}/>
              }
            }} />
            <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
            <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
            <Route path="/" name="Home" render={props => {
              if (!token) {
                return <Redirect to="/login"/>
              } else {
                return <TheLayout {...props}/>
              }
            }} />
          </Switch>
        </React.Suspense>
      </HashRouter>

      <Toaster toasters={toasts} />
    </AppContext.Provider>
  )
}

export default App;
