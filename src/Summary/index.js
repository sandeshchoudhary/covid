import React from 'react';
import { Card, Spinner, Text, Heading } from 'design-system';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import {
  PieChart, Pie, Sector, Cell,
} from 'recharts';
import './Summary.css';

const query = {
  INDIA: gql`
    {country(name: \"India\") { name, mostRecent { confirmed, deaths, recovered}}}
  `,
  WORLD: gql`
    { summary{
      confirmed,
      deaths,
      recovered } }
  `
};

const Summary = (props) => {
  const { entity } = props;

  const extractStats = (entity, result) => {
    const stats = entity === 'INDIA' ? result.country.mostRecent : result.summary;
    return stats;
  }

  const getChart = stats => {
    const data = [
      {
        name: 'Active', value: stats.confirmed - stats.deaths - stats.recovered
      },
      {
        name: 'Deaths', value: stats.deaths
      },
      {
        name: 'Recovered', value: stats.recovered
      }
    ]
    const COLORS = ['#0070dd', '#d93737', '#2ea843'];
    const RADIAN = Math.PI / 180; 
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
     const x  = cx + radius * Math.cos(-midAngle * RADIAN);
     const y = cy  + radius * Math.sin(-midAngle * RADIAN);
    
     return (
       <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
         {`${(percent * 100).toFixed(0)}%`}
       </text>
     );
   };
   return (
    <PieChart width={400} height={200} onMouseEnter={() => null}>
        <Pie
          data={data} 
          cx={200} 
          cy={100} 
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80} 
          fill="#8884d8"
        >
          {
            data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
          }
        </Pie>
      </PieChart>
   )
  }

  const getLegends = stats => {
    return (
      <ul>
        <li>Active</li>
        <li>Recovered</li>
        <li>Deaths</li>
      </ul>
    )
  }


  const { loading, error, data } = useQuery(query[entity]);
  return (
    <Card
      shadow="medium"
      style={{
        height: '100%',
        minHeight: '200px',
        width: '45%',
        padding: '16px'
      }}
    >
      <Text>{entity} STATISTICS</Text>
        {loading && (
          <div className="Spinner-container">
            <Spinner size="large" appearance="primary" />
          </div>
        )}
        {!loading && error && (
          <p>Error :(</p>
        )}
        {!loading && !error && (
          <div style={{display: 'flex', justifyContent: 'flex-start'}}>
            <div>
              {getChart(extractStats(entity, data))}
            </div>
            <div>
              <Heading appearance="subtle" size="m">
                Total Patients
              </Heading>
              <Text appearance="destructive" style={{fontSize: '40px'}}>
                {extractStats(entity, data).confirmed}
              </Text>
              {getLegends(extractStats(entity, data))}
            </div>
          </div>
        )}
    </Card>
    );
}

export default Summary;
