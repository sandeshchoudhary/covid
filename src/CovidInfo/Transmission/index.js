import React from 'react';
import { Heading, Text, Row, Column } from '@innovaccer/design-system';
import './Transmission.css';
import { ReactComponent as Touch } from './touch.svg';
import { ReactComponent as Spread } from './spread.svg';

const transmissionList = [
  {
    logo: (
      <div className="HealthcareIcon">
        <Touch style={{ width: '22px', height: '22px', display: 'block' }} />
      </div>
    ),
    info: 'Spreads from contact with infected surfaces or objects'
  },
  {
    logo: (
      <div className="HealthcareIcon">
        <Spread style={{ width: '22px', height: '22px', display: 'block' }} />
      </div>
    ),
    info: 'Spreads person-to-person via droplets'
  }
];

const Transmission = () => {
  const getTransmissions = () => {
    return transmissionList.map((item, index) => {
      return (
        <div key={index} className="Info-item">
          {item.logo}
          <Text>{item.info}</Text>
        </div>
      );
    });
  };

  return (
    <div className="Transmission-container p-4">
      <Heading>Transmission</Heading>
      <div>{getTransmissions()}</div>
    </div>
  );
};

export default Transmission;
