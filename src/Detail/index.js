import React from 'react';
import { BreadcrumbsWrapper, Breadcrumb, Link, Column, Row, Text, Table, Spinner } from '@innovaccer/design-system';
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
    header: () => (
      <div className="Stat-table-cell">
        <Text weight="strong">Name</Text>
      </div>
    )
  },
  {
    width: 200,
    pinned: false ? 'LEFT' : undefined,
    template: ({ x, rowIndex }) => <div className="Stat-table-cell">{x}</div>,
    get: ({ confirmed }) => ({
      x: confirmed
    }),
    header: () => (
      <div className="Stat-table-cell">
        <Text weight="strong">Confirmed Cases</Text>
      </div>
    )
  }
];

const Detail = (props) => {
  const { entity } = props;
  let history = useHistory();
  const params = useParams();
  const stateName = params.id;
  const type = entity === 'world' ? 'country' : 'state';
  const { loading, error, data } = useQuery(getQuery(type, stateName));

  const { loading: districtLoading, error: districtError, data: districtData } = useQuery(
    getQuery('district', stateName)
  );

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
        <Row>
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
          {entity === 'india' && (
            <Column {...columnOptions}>
              <Table
                style={{
                  maxHeight: 'calc(100vh - 222px)',
                  marginLeft: '16px'
                }}
                loadMore={() => null}
                loading={districtLoading || (!districtLoading && !districtData)}
                loadingMoreData={false}
                getGridActions={false ? undefined : undefined}
                buffer={5}
                dynamicRowHeight={false}
                rowHeight={50}
                headerHeight={40}
                virtualization={false}
                schema={schema}
                data={districtData ? districtData.district.districtData : []}
              />
            </Column>
          )}
        </Row>
      </div>
    </div>
  );
};

export default Detail;
