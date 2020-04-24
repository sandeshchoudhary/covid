import React from 'react';
import { Heading, Text, Row, Column } from 'design-system';
import './Precaution.css';
import { ReactComponent as Facemask } from './facemask.svg';
import { ReactComponent as Handwash } from './handwash.svg';
import { ReactComponent as Disinfectant } from './disinfectant.svg';
import { ReactComponent as Distance } from './distance.svg';

const precautionList = [
  {
    logo: <Facemask style={{ width: '24px', height: '24px', display: 'block' }} />,
    info: 'Use a medical face mask'
  },
  {
    logo: <Handwash style={{ width: '24px', height: '24px', display: 'block' }} />,
    info: 'Wash your hands with soap and water'
  },
  {
    logo: <Disinfectant style={{ width: '24px', height: '24px', display: 'block' }} />,
    info: 'Surfaces need to be wiped with disinfectant regularly'
  },
  {
    logo: <Distance style={{ width: '24px', height: '24px', display: 'block' }} />,
    info: 'Maintain atleast 1 meter (3 feet) distance between yourself & anyone'
  }
];

const columnOptions = {
  size: '12',
  sizeXL: '6',
  sizeL: '12',
  sizeM: '6',
  sizeS: '6'
};

const Precaution = () => {
  const getPrecautions = () => {
    return precautionList.map((item, index) => {
      return (
        // <Column {...columnOptions} key={index}>
        <div key={index}>
          {item.logo}
          <Text>{item.info}</Text>
        </div>
        // </Column>
      );
    });
  };

  return (
    <div className="Precaution-container p-4">
      <div className="Precaution-heading-container">
        <Heading>Precautions</Heading>
      </div>
      <div>{getPrecautions()}</div>
    </div>
  );
};

export default Precaution;
