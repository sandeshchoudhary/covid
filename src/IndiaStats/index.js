import React from 'react';
import { Link, Breadcrumb, BreadcrumbsWrapper, Table, Text, Row, Column, Spinner, Input, Card, Heading, RangePicker, Icon } from 'design-system';
import { useHistory } from 'react-router-dom';
import query from '../query';
import { useQuery } from '@apollo/react-hooks';
import axios from 'axios';

import './Stats.css';
import {
  ComposedChart,
  LineChart,
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

const columnOptions = {
  size: '12',
  sizeXL: '6',
  sizeL: '12',
  sizeM: '6',
  sizeS: '6'
};

const IndiaStats = (props) => {
  const { entity, queryType } = props;
  let history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeStampsLoading, setTimeStampsLoading] = useState(false);
  const [timeStampsData, setTimeStampsData] = useState([]);
  const [date, setDate] = useState();
  const [disabledDate, setDisabledDate] = useState({});
  const [reset, setReset] = useState(false);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleDrill = (id) => {
    history.push(`/${entity}/detail/${id}`);
  };

  const schema = [
    {
      width: 170,
      pinned: false ? 'LEFT' : undefined,
      template: ({ x, rowIndex }) => (
        <div className="Stat-table-cell">
          <Link onClick={() => handleDrill(x)}>{x}</Link>
        </div>
      ),
      get: ({ name, state }) => ({
        x: entity === 'india' ? state : name
      }),
      header: () => (
        <div className="Stat-table-cell">
          <Text weight="strong">Name</Text>
        </div>
      )
    },
    {
      width: 100,
      pinned: false ? 'LEFT' : undefined,
      template: ({ x, rowIndex }) => <div className="Stat-table-cell">{x}</div>,
      get: ({ mostRecent, confirmed }) => ({
        x: entity === 'india' ? confirmed : mostRecent.confirmed
      }),
      header: () => (
        <div className="Stat-table-cell">
          <Text weight="strong">Confirmed</Text>
        </div>
      )
    },
    {
      width: 100,
      pinned: false ? 'LEFT' : undefined,
      template: ({ x, rowIndex }) => <div className="Stat-table-cell">{x}</div>,
      get: ({ mostRecent, recovered }) => ({
        x: entity === 'india' ? recovered : mostRecent.recovered
      }),
      header: () => (
        <div className="Stat-table-cell">
          <Text weight="strong">Recovered</Text>
        </div>
      )
    },
    {
      width: 100,
      pinned: false ? 'LEFT' : undefined,
      template: ({ x, rowIndex }) => <div className="Stat-table-cell">{x}</div>,
      get: ({ mostRecent, deaths }) => ({
        x: entity === 'india' ? deaths : mostRecent.deaths
      }),
      header: () => (
        <div className="Stat-table-cell">
          <Text weight="strong">Deaths</Text>
        </div>
      )
    }
  ];

  useEffect(() => {
    setTimeStampsLoading(true);
    axios.get(`https://api.covid19india.org/data.json`)
      .then(res => {
        const { cases_time_series: data } = res.data;
        const sDate = new Date(data[0].date + "2020");
        const eDate = new Date(data[data.length - 1].date + "2020");
        const newDisabledDate = { ...date, before: sDate, after: eDate };
        setTimeStampsLoading(false);
        setTimeStampsData(data);
        setDisabledDate(newDisabledDate);
      })
  }, []);

  const onResetSearch = () => {
    setSearchQuery('');
  }

  const onResetDates = () => {
    const { before, after } = disabledDate;
    setDate({ startDate: before, endDate: after });
    setReset(true);
  }

  const onRangeChange = (sDate, eDate) => {
    const startDate = new Date(sDate);
    const endDate = new Date(eDate);
    setDate({ startDate, endDate });
    setReset(false);
  }

  const mapData = (list) => {
    let startInd = 0;
    let lastInd = list.length - 1;

    if (date) {
      const { startDate, endDate } = date;
      list.forEach((item, i) => {
        const itemDate = new Date(item.date);
        if (startDate && startDate.getMonth() == itemDate.getMonth() && startDate.getDate() == itemDate.getDate()) {
          startInd = i;
        }
        if (endDate && endDate.getMonth() == itemDate.getMonth() && endDate.getDate() == itemDate.getDate()) {
          lastInd = i;
        }
      });
    }

    return list
      .slice(startInd, lastInd + 1)
      .map(item => {
        return {
          date: item.date,
          confirmed: parseInt(item.totalconfirmed),
          recovered: Number(item.totalrecovered),
          deaths: Number(item.totaldeceased),
        }
      });
  }

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
      <header>
        <BreadcrumbsWrapper heading='India Statistics'>
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
          <Row>
            <Column {...columnOptions}>
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
                  <div className="Stats-heading" style={{ marginBottom: '12px' }}>
                    <Heading size="m">States and Uniton Territories</Heading>
                  </div>
                  <Row>
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
                  </Row>
                  <div className={'Stats-info'}><Text small={true}>Showing 37 States and UTs</Text></div>
                  <Table
                    style={{
                      maxHeight: 'calc(100vh - 65px)'
                    }}
                    loadMore={() => null}
                    loading={loading}
                    loadingMoreData={false}
                    getGridActions={false ? undefined : undefined}
                    buffer={10}
                    dynamicRowHeight={false}
                    rowHeight={50}
                    headerHeight={40}
                    virtualization={false}
                    schema={schema}
                    data={getData(entity, data)}
                  />

                </Card>
              </div>
            </Column>
            <Column {...columnOptions}>
              <div style={{ height: '100%', padding: '8px', alignItems: 'center' }}>
                <Card
                  shadow="medium"
                  style={{
                    padding: '16px',
                    backgroundColor: 'white'
                  }}
                >
                  <div className="Stats-heading" style={{ marginBottom: '21px' }}>
                    <Heading size="m">State-wise Statistics</Heading>
                    <Icon name="autorenew" appearance="subtle" size="24" onClick={onResetSearch} />
                  </div>
                  {loading && (
                    <div className="Spinner-container">
                      <Spinner size="large" appearance="primary" />
                    </div>
                  )}
                  {!loading && data && (
                    <ResponsiveContainer width={'100%'} height={250}>
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
                <Card
                  shadow="medium"
                  style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    marginTop: '16px',
                  }}
                >
                  <div className="Stats-heading" style={{ marginBottom: '10px' }}>
                    <Heading size="m">Date-wise Statistics</Heading>
                    <Icon name="autorenew" appearance="subtle" size="24" onClick={onResetDates} />
                  </div>
                  {timeStampsLoading && (
                    <div className="Spinner-container">
                      <Spinner size="large" appearance="primary" />
                    </div>
                  )}
                  {!timeStampsLoading && timeStampsData.length > 0 && (
                    <div>
                      <div className="Calendar-container" key={reset ? '1' : '2'}>
                        <RangePicker
                          withInput={true}
                          startDate={disabledDate.before}
                          endDate={disabledDate.after}
                          disabledBefore={disabledDate.before}
                          disabledAfter={disabledDate.after}
                          jumpView={true}
                          onRangeChange={onRangeChange}
                        />
                      </div>
                      <ResponsiveContainer width={'100%'} height={250}>
                        <LineChart
                          data={mapData(timeStampsData)}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line name="Confirmed" type="monotone" dataKey="confirmed" stroke="#8884d8" />
                          <Line name="Recovered" type="monotone" dataKey="recovered" stroke="#82ca9d" />
                          <Line name="Deaths" type="monotone" dataKey="deaths" stroke="#d93737" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
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

export default IndiaStats;
