import React from 'react';
import { Card, Spinner, Text, Heading, Subheading, Row, Column, Button, Legend, Icon } from 'design-system';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { PieChart, Pie, Sector, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './Summary.css';
import { getQuery } from '../query';

const columnOptions = {
  details: {
    size: '12',
    sizeXL: '4',
    sizeM: '4'
  },
  chart: {
    size: '12',
    sizeXL: '8',
    sizeM: '8'
  }
};

const Summary = (props) => {
  const { entity, type, showLink, drillCallback, stats = {} } = props;
  let history = useHistory();

  const Chart = (props) => {
    const { stats } = props;

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

    const renderActiveShape = (activeShapeProps) => {
      const RADIAN = Math.PI / 180;
      const {
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        payload,
        percent,
        value
      } = activeShapeProps;
      const sin = Math.sin(-RADIAN * midAngle);
      const cos = Math.cos(-RADIAN * midAngle);
      const sx = cx + (outerRadius + 10) * cos;
      const sy = cy + (outerRadius + 10) * sin;
      const mx = cx + (outerRadius + 30) * cos;
      const my = cy + (outerRadius + 30) * sin;
      const ex = mx + (cos >= 0 ? 1 : -1) * 22;
      const ey = my;
      const textAnchor = cos >= 0 ? 'start' : 'end';

      const total = Math.ceil(value / percent);

      return (
        <g>
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
          <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            dy={-18}
            textAnchor={textAnchor}
            fill={fill}
          >{`${payload.name}`}</text>
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
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={onPieEnter}
            outerRadius={80}
            innerRadius={35}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell fill={COLORS[index % COLORS.length]} key={index} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const getLegends = (stats) => {
    return (
      <div className="Summary-legends">
        <Legend icon="stop" labelWeight="medium" iconSize={24} iconAppearance="primary" label="Active" />
        <Legend icon="stop" labelWeight="medium" iconSize={24} iconAppearance="alert" label="Recovered" />
        <Legend icon="stop" labelWeight="medium" iconSize={24} iconAppearance="success" label="Deaths" />
      </div>
    );
  };

  const handleMore = (entity) => {
    drillCallback();
  };

  return (
    <Card
      shadow="medium"
      style={{
        padding: '16px',
        backgroundColor: 'white'
      }}
    >
      <div className="Summary-heading">
        <Heading size="m">{entity[0].toUpperCase() + entity.slice(1)} Statistics</Heading>
        <Icon name="open_in_new" appearance="subtle" size="24" onClick={() => handleMore(entity)} />
      </div>
      <Row>
        <Column {...columnOptions.details}>
          <div className="Summary-details">
            <div className="Summary-header">
              <Subheading>Total Patients</Subheading>
              <Heading size="xl">{stats.confirmed.toLocaleString()}</Heading>
            </div>
            <hr />
            {getLegends(stats)}
          </div>
        </Column>
        <Column {...columnOptions.chart}>
          <div className="Summary-chart">
            <Chart stats={stats} />
          </div>
        </Column>
      </Row>
      {/* {showLink && (
        <div>
          <Button appearance="primary" onClick={() => handleMore(entity)} icon="trending_flat" iconAlign="right">
            Show More
          </Button>
        </div>
      )} */}
    </Card>
  );
};

export default Summary;
