import React from 'react';
import Precaution from './Precaution';
import Symptom from './Symptom';
import Transmission from './Transmission';
import { Card } from '@innovaccer/design-system';
import './Info.css';

const CovidInfo = () => {
  return (
    <Card
      shadow="medium"
      style={{
        boxSizing: 'border-box',
        height: '100%',
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
