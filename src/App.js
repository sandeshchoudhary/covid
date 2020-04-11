import React from 'react';
import './App.css';
import { Heading } from 'design-system';
import Summary from './Summary';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Heading size="l" appearance="white">
          Covid-19
        </Heading>
      </header>
      <div className="App-body">
        <Summary entity="WORLD" />
        <Summary entity="INDIA" />
      </div>
    </div>
  );
}

export default App;
