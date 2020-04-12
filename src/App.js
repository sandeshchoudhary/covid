import React from 'react';
import './App.css';
import Summary from './Summary';
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
      <div className="App-body">
        <Row>
          <Column {...columnOptions}>
            <Summary entity="world" type="world" showLink={true} />
          </Column>
          <Column {...columnOptions}>
            <Summary entity="india" type="country" showLink={true} />
          </Column>
        </Row>
      </div>
    </div>
  );
}

export default App;
