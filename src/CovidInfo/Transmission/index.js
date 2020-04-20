import React from 'react';
import { Heading, Text, Row, Column } from 'design-system';
import './Transmission.css';
import { ReactComponent as Touch } from './touch.svg';
import { ReactComponent as Spread } from './spread.svg';


const transmissionList = [
  {
    logo: <Touch style={{width: '24px', height: '24px', display: 'block'}} />,
    info: 'Spreads from contact with infected surfaces or objects'
  },
  {
    logo: <Spread style={{width: '24px', height: '24px', display: 'block'}} />,
    info: 'Spreads person-to-person via droplets'
  }
];

const columnOptions = {
  size: "12",
  sizeXL: "6",
  sizeL: "12",
  sizeM: "6",
  sizeS: "6"
};

const Transmission = () => {
  const getTransmissions = () => {
    return transmissionList.map((item, index) => {
      return (
        <Column {...columnOptions} key={index}>
          <div>
            {item.logo}
            <Text>{item.info}</Text>
          </div>
        </Column>
      )
    })
  };

  return (
    <div className="Transmission-container p-4">
      <div className="Transmission-heading-container"><Heading>Transmission</Heading></div>
      <div>
        <Row>
          {getTransmissions()}
        </Row>
      </div>
    </div>
  );
}

export default Transmission;