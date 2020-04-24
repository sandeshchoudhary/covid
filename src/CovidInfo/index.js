import React from 'react';
import Precaution from './Precaution';
import Symptom from './Symptom';
import Transmission from './Transmission';
import { Row, Column, Card } from 'design-system';

const precautionColumnOptions = {
  size: '12',
  sizeXL: '8',
  sizeL: '12',
  sizeM: '8',
  sizeS: '8'
};

const symptonColumnOptions = {
  size: '12',
  sizeXL: '4',
  sizeL: '12',
  sizeM: '4',
  sizeS: '4'
};

const CovidInfo = () => {
  return (
    <Card
      shadow="medium"
      style={{
        minHeight: '200px',
        padding: '16px',
        backgroundColor: 'white'
      }}
    >
      <Precaution />
      <Symptom />
      <Transmission />
    </Card>
  );
};

export default CovidInfo;
