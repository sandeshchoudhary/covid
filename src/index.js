import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';
import { client } from './api';
import Header from './Header';
import Footer from './Footer';
import Stats from './Stats';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

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
            <Route path="/india">
              <Stats entity="INDIA" />
            </Route>
            <Route path="/world">
              <Stats entity="WORLD" />
            </Route>
          </Switch>
        </Router>
        <Footer />
      </div>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
