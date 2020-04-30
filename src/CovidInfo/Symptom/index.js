import React from 'react';
import { Heading, Text, Row, Column } from '@innovaccer/design-system';
import './Symptom.css';
import { ReactComponent as Fever } from './fever.svg';
import { ReactComponent as Lungs } from './lungs.svg';
import { ReactComponent as Breath } from './breath.svg';

const symptomList = [
  {
    logo: (
      <div className="HealthcareIcon">
        <Fever style={{ width: '22px', height: '22px', display: 'block' }} />
      </div>
    ),
    info: 'Fever, Cough'
  },
  {
    logo: (
      <div className="HealthcareIcon">
        <Lungs style={{ width: '22px', height: '22px', display: 'block' }} />
      </div>
    ),
    info: 'Respiratoy Symptoms'
  },
  {
    logo: (
      <div className="HealthcareIcon">
        <Breath style={{ width: '22px', height: '22px', display: 'block' }} />
      </div>
    ),
    info: 'Shortness of Breath'
  }
];

const Symptom = () => {
  const getSymptoms = () => {
    return symptomList.map((item, index) => {
      return (
        <div key={index} className="Info-item">
          {item.logo}
          <Text>{item.info}</Text>
        </div>
      );
    });
  };

  return (
    <div className="Symptom-container p-4">
      <Heading>Symptoms</Heading>
      <div>{getSymptoms()}</div>
    </div>
  );
};

export default Symptom;
