import React from 'react';
import './App.css';
import Summary from './Summary';
import Header from './Header';
import Footer from './Footer';
import { Row, Column } from 'design-system';

const columnOptions = {
  size: "12",
  sizeXL: "6",
  sizeL: "12",
  sizeM: "6",
  sizeS: "6"
};

const App = () => {
  return (
    <div className="App">
      <Header />
      <div className="App-body">
        <Row>
          <Column {...columnOptions}>
            <Summary entity="WORLD" />
          </Column>
          <Column {...columnOptions}>
            <Summary entity="INDIA" />
          </Column>
        </Row>
      </div>
      <Footer />
    </div>
  );
}

export default App;
