import React from 'react';
import { Link, Breadcrumb, BreadcrumbsWrapper, Table, Text, Row, Column, Spinner, Input, Card, Heading, Icon } from '@innovaccer/design-system';
import { useHistory } from 'react-router-dom';
import query from '../query';
import { useQuery } from '@apollo/react-hooks';
import './Stats.css';
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Area,
  Bar,
  Line,
  ResponsiveContainer
} from 'recharts';
const { useEffect, useState } = React;

const WorldStats = (props) => {
  const { entity, queryType } = props;
  let history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleDrill = (id) => {
    history.push(`/${entity}/detail/${id}`);
  };

  const onResetSearch = () => {
    setSearchQuery('');
  }

  const schema = [
    {
      width: 200,
      name: 'name',
      displayName: 'Name',
      pinned: 'LEFT',
      template: ({ x, rowIndex }) => (
        <div className="Stat-table-cell">
          <Link onClick={() => handleDrill(x)}>{x}</Link>
        </div>
      ),
      get: ({ name, state }) => ({
        x: entity === 'india' ? state : name
      })
    },
    {
      width: 100,
      name: 'confirmed',
      displayName: 'Confirmed',
      get: ({ mostRecent, confirmed }) => ({
        confirmed: entity === 'india' ? confirmed : mostRecent.confirmed
      })
    },
    {
      width: 100,
      name: 'recovered',
      displayName: 'Recovered',
      get: ({ mostRecent, recovered }) => ({
        recovered: entity === 'india' ? recovered : mostRecent.recovered
      })
    },
    {
      width: 100,
      name: 'deaths',
      displayName: 'Deaths',
      get: ({ mostRecent, deaths }) => ({
        deaths: entity === 'india' ? deaths : mostRecent.deaths
      })
    }
  ];

  const getData = (entity, data = {}) => {
    const list = entity === 'india' ? data.india.statewise : data.countries;
    if (!list) return [];
    return list
      .filter((item) => {
        if (entity === 'india') {
          return item.state.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1 && item.state !== 'Total';
        }
        return item.name.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
      })
      .map((item) => {
        if (entity === 'india') {
          return {
            ...item,
            ...{
              name: item.state,
              recovered: Number(item.recovered),
              deaths: Number(item.deaths),
              confirmed: Number(item.confirmed)
            }
          };
        }
        return item;
      });
  };

  const { loading, error, data } = useQuery(query[queryType]);

  return (
    <div className="Stats-container">
      <header className="Stats-header">
        <BreadcrumbsWrapper heading='World Statistics'>
          <Breadcrumb>
            <div className="Breadcrumb-link">
              <Link onClick={() => history.push('/')}>HOME</Link>
            </div>
          </Breadcrumb>
        </BreadcrumbsWrapper>
      </header>

      {error && <div>error...</div>}

      {!error && !loading && data && (
        <div className="Stats-body">
          <Row group={'1'} groupXL={'2'}>
            <Column>
              <div style={{ height: '100%', padding: '8px', boxSizing: 'border-box' }}>
                <Card
                  shadow="medium"
                  style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    height: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <div className="Stats-heading">
                    <Heading size="m">Countries</Heading>
                  </div>
                  <div className="d-flex py-5" >
                    <Input
                      clearButton={true}
                      value={searchQuery}
                      icon="search"
                      name="input"
                      placeholder="Search"
                      onChange={(ev) => handleSearch(ev.target.value)}
                      onClear={() => handleSearch('')}
                      info="Search on name"
                    />
                  </div>
                  <div>
                    <Table
                      style={{
                        maxHeight: 'calc(100vh - 340px)'
                      }}
                      loading={loading}
                      limit={7}
                      rowHeight={40}
                      schema={schema}
                      pagination={true}
                      data={getData(entity, data)}
                    />
                  </div>
                </Card>
              </div>
            </Column>
            <Column>
              <div style={{ boxSizing: 'border-box', height: '100%', padding: '8px', alignItems: 'center' }}>
                <Card
                  shadow="medium"
                  style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    height: '100%'
                  }}
                >
                  <div className="Stats-heading" style={{ marginBottom: '21px' }}>
                    <Heading size="m">Country-wise Statistics</Heading>
                    <Icon name="autorenew" appearance="subtle" size="24" onClick={onResetSearch} />
                  </div>
                  {loading && (
                    <div className="Spinner-container">
                      <Spinner size="large" appearance="primary" />
                    </div>
                  )}
                  {!loading && data && (
                    <ResponsiveContainer height={420}>
                      <ComposedChart data={getData(entity, data)}>
                        <XAxis dataKey={entity === 'india' ? 'state' : 'name'} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <CartesianGrid stroke="#f5f5f5" />
                        <Area
                          name="Recovered"
                          type="monotone"
                          dataKey={entity === 'india' ? 'recovered' : 'mostRecent[recovered]'}
                          fill="#71c077"
                          stroke="#2ea843"
                        />
                        <Bar
                          name="Confirmed"
                          barSize={20}
                          dataKey={entity === 'india' ? 'confirmed' : 'mostRecent[confirmed]'}
                          fill="#0070dd"
                        />
                        <Line
                          name="Deaths"
                          type="monotone"
                          dataKey={entity === 'india' ? 'deaths' : 'mostRecent[deaths]'}
                          stroke="#d93737"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </Card>
              </div>
            </Column>
          </Row>
        </div>
      )}
    </div>
  );
};

export default WorldStats;
