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
import Detail from './Detail';
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
            <Route path="/india/detail/:id" exact>
              <Detail entity="india" />
            </Route>
            <Route path="/world/detail/:id" exact>
              <Detail entity="world" />
            </Route>
            <Route path="/india">
              <Stats entity="india" />
            </Route>
            <Route path="/world">
              <Stats entity="world" />
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
