import React from 'react';
import { BreadcrumbsWrapper, Breadcrumb, Link, Column, Row, Text, Table, Spinner, Input } from 'design-system';
import { useHistory, useParams } from 'react-router-dom';
import './Detail.css';
import StatsCard from '../Summary';
import { useQuery } from '@apollo/react-hooks';
import { getQuery } from '../query';

const columnOptions = {
  size: '12',
  sizeXL: '6',
  sizeL: '12',
  sizeM: '6',
  sizeS: '6'
};

const loaderSchema = [
  {
    width: 200,
  },
  {
    width: 200,
  },
];


const schema = [
  {
    width: 200,
    pinned: false ? 'LEFT' : undefined,
    template: ({ x, rowIndex }) => (
      <div className="Stat-table-cell">
        <Link onClick={() => null}>{x}</Link>
      </div>
    ),
    get: ({ district }) => ({
      x: district
    }),
    name: 'name',
    displayName: 'Name'
  },
  {
    width: 200,
    pinned: false ? 'LEFT' : undefined,
    template: ({ x, rowIndex }) => <div className="Stat-table-cell">{x}</div>,
    get: ({ confirmed }) => ({
      x: confirmed
    }),
    name: 'confirmed',
    displayName: 'Confirmed Cases'
  }
];

const Detail = (props) => {
  const { entity } = props;
  let history = useHistory();
  const params = useParams();
  const stateName = params.id;
  const type = entity === 'world' ? 'country' : 'state';
  const [searchQuery, setSearchQuery] = React.useState('');
  const { loading, error, data } = useQuery(getQuery(type, stateName));

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const { loading: districtLoading, error: districtError, data: districtData } = useQuery(
    getQuery('district', stateName)
  );

  const getData = (data) => {
    if (!data || data.length === 0) return [];
    return data
      .filter((item) => {
        return item.district.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
      })
  };

  const getWorldStats = (data) => {
    const stats = {
      ...data,
      ...{
        active: data.confirmed - data.deaths - data.recovered
      }
    };
    return stats;
  };

  const getStateStats = (data) => {
    const index = data.findIndex((item) => {
      return item.state === stateName;
    });
    return index > -1 ? data[index] : {};
  };

  return (
    <div className="Detail-container">
      <header>
        <BreadcrumbsWrapper heading={`${params.id} - Breakdown`}>
          <Breadcrumb>
            <div className="Breadcrumb-link">
              <Link onClick={() => history.push('/')}>HOME</Link>
            </div>
          </Breadcrumb>
          <Breadcrumb>
            <div className="Breadcrumb-link">
              <Link onClick={() => history.push(`/${entity}`)}>{entity.toUpperCase()}</Link>
            </div>
          </Breadcrumb>
        </BreadcrumbsWrapper>
      </header>
      <div className="Detail-body">
        {entity === 'india' && (
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
        )}
        <Row>
          {entity === 'india' && (
            <Column {...columnOptions}>
              <Table
                style={{
                  maxHeight: 'calc(100vh - 300px)',
                  marginRight: '16px'
                }}
                loadMore={() => null}
                loading={districtLoading || (!districtLoading && !districtData)}
                loadingMoreData={false}
                getGridActions={false ? undefined : undefined}
                buffer={5}
                dynamicRowHeight={false}
                loaderSchema={loaderSchema}
                schema={schema}
                data={getData(districtData ? districtData.district.districtData : [])}
                pagination={true}
              />
            </Column>
          )}
          <Column {...columnOptions}>
            {loading && (
              <div className="Spinner-container">
                <Spinner size="large" appearance="primary" />
              </div>
            )}
            {!loading && data && (
              <StatsCard
                entity={params.id}
                showLink={false}
                stats={
                  entity === 'world' ? getWorldStats(data.country.mostRecent) : getStateStats(data.india.statewise)
                }
                drillCallback={null}
              />
            )}
          </Column>
        </Row>
      </div>
    </div>
  );
};

export default Detail;
