import React from 'react';
import { Heading, Text } from 'design-system';
import './Precaution.css';
import { ReactComponent as Facemask } from './facemask.svg';
import { ReactComponent as Handwash } from './handwash.svg';
import { ReactComponent as Disinfectant } from './disinfectant.svg';
import { ReactComponent as Distance } from './distance.svg';

const precautionList = [
  {
    logo: (
      <div className="HealthcareIcon">
        <Facemask style={{ width: '22px', height: '22px', display: 'block' }} />
      </div>
    ),
    info: 'Use a medical face mask'
  },
  {
    logo: (
      <div className="HealthcareIcon">
        <Handwash style={{ width: '22px', height: '22px', display: 'block' }} />
      </div>
    ),
    info: 'Wash your hands with soap and water'
  },
  {
    logo: (
      <div className="HealthcareIcon">
        <Disinfectant style={{ width: '22px', height: '22px', display: 'block' }} />
      </div>
    ),
    info: 'Surfaces need to be wiped with disinfectant regularly'
  },
  {
    logo: (
      <div className="HealthcareIcon">
        <Distance style={{ width: '22px', height: '22px', display: 'block' }} />
      </div>
    ),
    info: 'Maintain atleast 1 meter (3 feet) distance between yourself & anyone'
  }
];

const Precaution = () => {
  const getPrecautions = () => {
    return precautionList.map((item, index) => {
      return (
        <div key={index} className="Info-item">
          {item.logo}
          <Text>{item.info}</Text>
        </div>
      );
    });
  };

  return (
    <div className="Precaution-container p-4">
      <Heading>Precautions</Heading>
      <div>{getPrecautions()}</div>
    </div>
  );
};

export default Precaution;
