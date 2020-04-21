import React from 'react';
import { Card, Spinner, Text, Heading, Row, Column, Button } from 'design-system';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { PieChart, Pie, Sector, Cell, Tooltip } from 'recharts';
import './Summary.css';
import { getQuery } from '../query';

const columnOptions = {
  size: '12',
  sizeXL: '6',
  sizeL: '12',
  sizeM: '6',
  sizeS: '6'
};

const Summary = (props) => {
  const { entity, type, showLink, drillCallback, stats = {} } = props;
  let history = useHistory();

  const getChart = (stats) => {
    const data = [
      {
        name: 'Active',
        value: Number(stats.active)
      },
      {
        name: 'Deaths',
        value: Number(stats.deaths)
      },
      {
        name: 'Recovered',
        value: Number(stats.recovered)
      }
    ];
    const COLORS = ['#0070dd', '#d93737', '#2ea843'];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };
    return (
      <PieChart width={200} height={200} onMouseEnter={() => null}>
        <Pie
          data={data}
          dataKey="value"
          cx={100}
          cy={100}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell fill={COLORS[index % COLORS.length]} key={index} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  };

  const getLegends = (stats) => {
    return (
      <ul className="Summary-list">
        <li className="Summary-list-item" key="0">
          <div className="Legend Legend--primary"></div>
          <Text>Active - {stats.confirmed - stats.deaths - stats.recovered}</Text>
        </li>
        <li key="1" className="Summary-list-item">
          <div className="Legend Legend--success"></div>
          <Text>Recovered - {stats.recovered}</Text>
        </li>
        <li key="2" className="Summary-list-item">
          <div className="Legend Legend--alert"></div>
          <Text>Deaths - {stats.deaths}</Text>
        </li>
      </ul>
    );
  };

  const handleMore = (entity) => {
    drillCallback();
  };

  return (
    <Card
      shadow="medium"
      style={{
        minHeight: '200px',
        padding: '16px'
      }}
    >
      <Text>{entity.toUpperCase()} STATISTICS</Text>
      <Row>
        <Column {...columnOptions}>{getChart(stats)}</Column>
        <Column {...columnOptions}>
          <Heading appearance="subtle" size="m">
            Total Patients
          </Heading>
          <Text appearance="destructive" style={{ fontSize: '40px' }}>
            {stats.confirmed}
          </Text>
          {getLegends(stats)}
        </Column>
      </Row>
      {showLink && (
        <div>
          <Button appearance="primary" onClick={() => handleMore(entity)} icon="trending_flat" iconAlign="right">
            Show More
          </Button>
        </div>
      )}
    </Card>
  );
};

export default Summary;
