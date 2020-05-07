import React from 'react';
import {
  Card,
  Heading,
  Subheading,
  Row,
  Column,
  Legend,
  Icon,
  DonutChart,
  Placeholder,
  PlaceholderParagraph,
  Spinner
} from '@innovaccer/design-system';
import './Summary.css';

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

const getLegends = () => {
  return (
    <div className="Summary-legends">
      <Legend labelWeight="medium" iconAppearance="primary" label="Active" />
      <Legend labelWeight="medium" iconAppearance="success" label="Recovered" />
      <Legend labelWeight="medium" iconAppearance="alert" label="Deaths" />
    </div>
  );
};

const Summary = (props) => {
  const { entity, drillCallback, stats = {} } = props;

  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 575);

  function handleResize() {
    setIsMobile(window.innerWidth <= 575);
  }
  window.addEventListener('resize', handleResize);

  const handleMore = (entity) => {
    drillCallback();
  };

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

  return (
    <Card
      shadow="light"
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
              {stats.confirmed ? (
                <Heading size="xl">{(+stats.confirmed).toLocaleString()}</Heading>
              ) : (
                <Placeholder>
                  <PlaceholderParagraph length="medium" />
                </Placeholder>
              )}
            </div>
            <hr />
            {getLegends()}
          </div>
        </Column>
        <Column {...columnOptions.chart}>
          <div className="Summary-chart">
            {Object.keys(stats).length ? (
              <DonutChart
                data={data}
                withCenterText={false}
                withActiveSegment={!isMobile}
                withTooltip={isMobile}
                donutWidth={60}
                colors={['primary', 'alert', 'success']}
              />
            ) : (
              <div className="Spinner-container h-100">
                <Spinner />
              </div>
            )}
          </div>
        </Column>
      </Row>
    </Card>
  );
};

export default Summary;
