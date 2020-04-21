import React from 'react';
import { Heading, Text, Row, Column } from 'design-system';
import './Symptom.css';
import { ReactComponent as Fever } from './fever.svg';
import { ReactComponent as Lungs } from './lungs.svg';
import { ReactComponent as Breath } from './breath.svg';

const symptomList = [
  {
    logo: <Fever style={{ width: '24px', height: '24px', display: 'block' }} />,
    info: 'Fever, Cough'
  },
  {
    logo: <Lungs style={{ width: '24px', height: '24px', display: 'block' }} />,
    info: 'Respiratoy Symptoms'
  },
  {
    logo: <Breath style={{ width: '24px', height: '24px', display: 'block' }} />,
    info: 'Shortness of Breath'
  }
];

const columnOptions = {
  size: '12',
  sizeXL: '12',
  sizeL: '12',
  sizeM: '12',
  sizeS: '12'
};

const Symptom = () => {
  const getSymptoms = () => {
    return symptomList.map((item, index) => {
      return (
        <Column {...columnOptions} key={index}>
          <div>
            {item.logo}
            <Text>{item.info}</Text>
          </div>
        </Column>
      );
    });
  };

  return (
    <div className="Symptom-container p-4">
      <div className="Symptom-heading-container">
        <Heading>Symptoms</Heading>
      </div>
      <div>
        <Row>{getSymptoms()}</Row>
      </div>
    </div>
  );
};

export default Symptom;
