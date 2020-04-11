import React from 'react';
import './App.css';
import Summary from './Summary';
import Header from './Header';
import Footer from './Footer';

const App = () => {
  return (
    <div className="App">
      <Header />
      <div className="App-body">
        <Summary entity="WORLD" />
        <Summary entity="INDIA" />
      </div>
      <Footer />
    </div>
  );
}

export default App;
