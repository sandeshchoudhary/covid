import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';
import { client } from './api';
import Header from './Header';
import Footer from './Footer';
import IndiaStats from './IndiaStats';
import WorldStats from './WorldStats';
import Detail from './Detail';
import References from './References';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <div>
        <Header />
        <Router basename={process.env.PUBLIC_URL}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/india/detail/:id" exact>
              <Detail entity="india" />
            </Route>
            <Route path="/world/detail/:id" exact>
              <Detail entity="world" />
            </Route>
            <Route path="/india">
              <IndiaStats entity="india" queryType="india" />
            </Route>
            <Route path="/world">
              <WorldStats entity="world" queryType="countries" />
              {/* <Stats entity="world" /> */}
            </Route>
            <Route path="/references">
              <References />
            </Route>
          </Switch>
          <Footer />
        </Router>
      </div>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
