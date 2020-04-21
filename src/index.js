import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';
import { client } from './api';
import Header from './Header';
import Footer from './Footer';
import StatsData from './Stats';
import Detail from './Detail';
import References from './References';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <div>
        <Header />
        <Router basename="/covid">
          <Switch>
            <Route exact path="/">
              <App />
            </Route>
            <Route path="/india/detail/:id" exact>
              <Detail entity="india" />
            </Route>
            <Route path="/world/detail/:id" exact>
              <Detail entity="world" />
            </Route>
            <Route path="/india">
              <StatsData entity="india" queryType="india" />
            </Route>
            <Route path="/world">
              <StatsData entity="world" queryType="countries" />
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
