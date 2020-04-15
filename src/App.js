import React from 'react';
import './App.css';
import Summary from './Summary';
import { Row, Column, Message, Text } from 'design-system';
import HeatMapIndia from './HeatMaps/India';

const columnOptions = {
  size: "12",
  sizeXL: "6",
  sizeL: "12",
  sizeM: "6",
  sizeS: "6"
};

const getLegends = () => {
  return (
    <ul className="Summary-list mt-4">
      <li className="Summary-list-item" key="0">
        <div className="Legend Legend--mirch-lightest"></div>
        <Text> &#60;&#61; 2%</Text>
      </li>
      <li className="Summary-list-item" key="1">
        <div className="Legend Legend--mirch-lighter"></div>
        <Text> &#62; 2% and &#60;&#61; 4% </Text>
      </li>
      <li className="Summary-list-item" key="2">
        <div className="Legend Legend--mirch-light"></div>
        <Text> &#62; 4% and &#60;&#61; 8% </Text>
      </li>
      <li className="Summary-list-item" key="3">
        <div className="Legend Legend--mirch"></div>
        <Text> &#62; 8% and &#60;&#61; 10% </Text>
      </li>
      <li className="Summary-list-item" key="4">
        <div className="Legend Legend--mirch-dark"></div>
        <Text> &#62; 10% and &#60;&#61; 20% </Text>
      </li>
      <li className="Summary-list-item" key="5">
        <div className="Legend Legend--mirch-darker"></div>
        <Text> &#62; 20%</Text>
      </li>
    </ul>
  )
}

const App = () => {
  return (
    <div className="App">
      <div className="App-body">
        <Row>
          <Column {...columnOptions}>
            <HeatMapIndia />
          </Column>
          <Column {...columnOptions}>
            <div className="p-6">
              <Message appearance="info">
                This portal is not responsible for any kind of misinformation provided as all the data is from referenced data sources.
              </Message>
              <Text appearance="subtle" weight="strong" size="large">Heat map of India (Confirmed cases)</Text>
              {getLegends()}
            </div>
          </Column>
        </Row>
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
