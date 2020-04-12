import React from 'react';
import { Link, Breadcrumb, BreadcrumbsWrapper, Table, Text, Row, Column, Spinner } from 'design-system';
import { useHistory } from "react-router-dom";
import query from '../query';
import { useQuery } from '@apollo/react-hooks';
import './Stats.css';
import { ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Area, Bar, Line, ResponsiveContainer } from 'recharts';


const columnOptions = {
  size: "12",
  sizeXL: "6",
  sizeL: "12",
  sizeM: "6",
  sizeS: "6"
};

const Stats = props => {
  const { entity } = props;
  let history = useHistory();

  const handleDrill = id => {
    history.push(`/${entity}/detail/${id}`)
  }

  const schema = [
    {
      width: 200,
      pinned: false ? 'LEFT' : undefined,
      template: ({ x, rowIndex }) => (
        <div className="Stat-table-cell">
          <Link onClick={() => handleDrill(x)}>{x}</Link>
        </div>
      ),
      get: ({ name }) => ({
        x: name,
      }),
      header: () => <div className="Stat-table-cell"><Text weight="strong">Name</Text></div>,
    },
    {
      width: 100,
      pinned: false ? 'LEFT' : undefined,
      template: ({ x, rowIndex }) => (
        <div className="Stat-table-cell">
          {x}
        </div>
      ),
      get: ({ mostRecent }) => ({
        x: mostRecent.confirmed,
      }),
      header: () => <div className="Stat-table-cell"><Text weight="strong">Confirmed</Text></div>,
    },
    {
      width: 100,
      pinned: false ? 'LEFT' : undefined,
      template: ({ x, rowIndex }) => (
        <div className="Stat-table-cell">
          {x}
        </div>
      ),
      get: ({ mostRecent }) => ({
        x: mostRecent.recovered,
      }),
      header: () => <div className="Stat-table-cell"><Text weight="strong">Recovered</Text></div>,
    },
    {
      width: 100,
      pinned: false ? 'LEFT' : undefined,
      template: ({ x, rowIndex }) => (
        <div className="Stat-table-cell">
          {x}
        </div>
      ),
      get: ({ mostRecent }) => ({
        x: mostRecent.deaths,
      }),
      header: () => <div className="Stat-table-cell"><Text weight="strong">Deaths</Text></div>,
    }
  ]

  const getData = (entity, data = {}) => {
    return entity === 'india' ? data.states : data.countries;
  }

  const { loading, error, data } = useQuery(query.stats[entity]);
  console.log(loading, error, data);


  return (
    <div className="Stats-container">
      <header>
        <BreadcrumbsWrapper
          heading={entity === 'india' ? 'State wise Data' : 'Country wise Data'}
        >
          <Breadcrumb>
            <div className="Breadcrumb-link">
              <Link onClick={() => history.push('/')}>HOME</Link>
            </div>
          </Breadcrumb>
        </BreadcrumbsWrapper>
      </header>

      {error && (
        <div>error...</div>
      )}

      {!error && (
        <div className="Stats-body">
          <Row>
            <Column {...columnOptions}>
              <Table
                style={{
                  maxHeight: 'calc(100vh - 252px)'
                }}
                loadMore={() => null}
                loading={loading}
                loadingMoreData={false}
                getGridActions={false ? undefined : undefined}
                buffer={5}
                dynamicRowHeight={false}
                rowHeight={50}
                headerHeight={40}
                virtualization={false}
                schema={schema}
                data={getData(entity, data)}
              />
            </Column>
            <Column {...columnOptions}>
              {loading && (
                <div className="Spinner-container">
                  <Spinner size="large" appearance="primary" />
                </div>
              )}
              {!loading && (
                <ResponsiveContainer width={'100%'} height={250}>
                  <ComposedChart data={getData(entity, data)}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Area name="Recovered" type="monotone" dataKey="mostRecent[recovered]" fill="#71c077" stroke="#2ea843" />
                    <Bar name="Confirmed" dataKey="mostRecent[confirmed]" barSize={20} fill="#0070dd" />
                    <Line name="Deaths" type="monotone" dataKey="mostRecent[deaths]" stroke="#d93737" />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </Column>
          </Row>
        </div>                                    
      )}
    </div>  
  );
}

export default Stats;
