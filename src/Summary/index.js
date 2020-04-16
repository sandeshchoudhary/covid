import React from 'react';
import { Card, Spinner, Text, Heading, Row, Column, Button } from 'design-system';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from "react-router-dom";
import {
  PieChart, Pie, Sector, Cell
} from 'recharts';
import './Summary.css';
import { getQuery } from '../query';

const columnOptions = {
  size: "12",
  sizeXL: "6",
  sizeL: "12",
  sizeM: "6",
  sizeS: "6"
};

const Summary = (props) => {
  const { entity, type, showLink } = props;
  let history = useHistory();

  const extractStats = (entity, result) => {
    const stats = type === 'country' ? result.country.mostRecent : type === 'state' ? result.state.mostRecent : result.summary;
    return stats;
  }

  const Chart = props => {
    const { stats } = props;
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
    // const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    //   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
    //   const y = cy + radius * Math.sin(-midAngle * RADIAN);

    //   return (
    //     <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
    //       {`${(percent * 100).toFixed(0)}%`}
    //     </text>
    //   );
    // };

    const renderActiveShape = (props) => {
      const RADIAN = Math.PI / 180;
      const {
        cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value,
      } = props;
      const sin = Math.sin(-RADIAN * midAngle);
      const cos = Math.cos(-RADIAN * midAngle);
      const sx = cx + (outerRadius + 10) * cos;
      const sy = cy + (outerRadius + 10) * sin;
      const mx = cx + (outerRadius + 30) * cos;
      const my = cy + (outerRadius + 30) * sin;
      const ex = mx + (cos >= 0 ? 1 : -1) * 22;
      const ey = my;
      const textAnchor = cos >= 0 ? 'start' : 'end';

      return (
        <g>
          <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
          />
          <Sector
            cx={cx}
            cy={cy}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={outerRadius + 6}
            outerRadius={outerRadius + 10}
            fill={fill}
          />
          <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
          <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
          <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
          <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        </g>
      );
    };

    const [activeIndex, setActiveIndex] = React.useState(0);

    const onPieEnter = (_data, index) => {
      setActiveIndex(index);
    };

    return (
      <PieChart width={400} height={300} onMouseEnter={() => null}>
        <Pie
          data={data}
          dataKey="value"
          cx={200}
          cy={150}
          labelLine={false}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          outerRadius={80}
          innerRadius={60}
          onMouseEnter={onPieEnter}
          fill="#8884d8"
        >
          {
            data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} key={index} />)
          }
        </Pie>
      </PieChart>
    )
  }

  const getLegends = stats => {
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
    )
  }

  const handleMore = entity => {
    if (entity === 'india') {
      history.push('/india');
    } else {
      history.push('/world');
    }
  }


  const { loading, error, data } = useQuery(getQuery(type, entity));
  return (
    <Card
      shadow="medium"
      style={{
        minHeight: '300px',
        padding: '16px'
      }}
    >
      <Text>{entity.toUpperCase()} STATISTICS</Text>
      {loading && (
        <div className="Spinner-container">
          <Spinner size="large" appearance="primary" />
        </div>
      )}
      {!loading && error && (
        <p>Error :(</p>
      )}
      {!loading && !error && (
        <React.Fragment>
          <Row>
            <Column {...columnOptions}>
              <Chart stats={extractStats(entity, data)} />
            </Column>
            <Column {...columnOptions}>
              <Heading appearance="subtle" size="m">
                Total Patients
                </Heading>
              <Text appearance="destructive" style={{ fontSize: '40px' }}>
                {extractStats(entity, data).confirmed}
              </Text>
              {getLegends(extractStats(entity, data))}
            </Column>
          </Row>
          {showLink && (
            <div>
              <Button appearance="primary" onClick={() => handleMore(entity)}
                icon="trending_flat"
                iconAlign="right">
                Show More
                </Button>
            </div>
          )}
        </React.Fragment>
      )}
    </Card>
  );
}

export default Summary;
