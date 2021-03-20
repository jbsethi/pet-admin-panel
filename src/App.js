import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import useToken from './useToken';
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

  return (
    <AppContext.Provider value={{ setToken }}>
      <BrowserRouter>
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
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App;
