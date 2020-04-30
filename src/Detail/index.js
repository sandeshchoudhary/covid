import React from 'react';
import { BreadcrumbsWrapper, Breadcrumb, Link, Column, Row, Text, Table, Spinner, Card, Input, Heading } from 'design-system';
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

  const { loading: districtLoading, error: districtError, data: districtData } = useQuery(
    getQuery('district', stateName)
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
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

  const getData = (data) => {
    if (!data || data.length === 0) return [];
    return data
      .filter((item) => {
        return item.district.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
      })
  };

  return (
    <div className="Detail-container">
      <header>
        <BreadcrumbsWrapper heading={`${params.id}`}>
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
        <Row>
          {entity === 'india' && (
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
                    <Heading size="m">{`${params.id} Districts`}</Heading>
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
                  <div style={{ marginTop: '16px' }}>
                    <Table
                      style={{
                        maxHeight: 'calc(100vh - 50vh)'
                      }}
                      loadMore={() => null}
                      loading={districtLoading || (!districtLoading && !districtData)}
                      loadingMoreData={false}
                      getGridActions={false ? undefined : undefined}
                      buffer={10}
                      dynamicRowHeight={false}
                      rowHeight={50}
                      headerHeight={40}
                      virtualization={false}
                      schema={schema}
                      pagination={true}
                      data={getData(districtData ? districtData.district.districtData : [])}
                    />
                  </div>
                </Card>
              </div>
            </Column>
          )}
          <Column {...columnOptions}>
            {loading && (
              <div className="Spinner-container">
                <Spinner size="large" appearance="primary" />
              </div>
            )}
            {!loading && data && (
              <div style={{ height: '100%', padding: '8px', boxSizing: 'border-box' }}>
                <StatsCard
                  entity={params.id}
                  showLink={false}
                  stats={
                    entity === 'world' ? getWorldStats(data.country.mostRecent) : getStateStats(data.india.statewise)
                  }
                  drillCallback={null}
                />
              </div>
            )}
          </Column>
        </Row>
      </div>
    </div>
  );
};

export default Detail;
