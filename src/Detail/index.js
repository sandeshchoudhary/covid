import React from 'react';
import {
  BreadcrumbsWrapper,
  Breadcrumb,
  Link,
  Column,
  Row,
  Text,
  Table,
  Spinner,
  Card,
  Input,
  Heading
} from '@innovaccer/design-system';
import { useHistory, useParams } from 'react-router-dom';
import './Detail.css';
import { useQuery } from '@apollo/react-hooks';
import { getQuery } from '../query';
import Summary from '../Summary';

const loaderSchema = [
  {
    width: 170
  },
  {
    width: 100
  },
  {
    width: 100
  },
  {
    width: 100
  }
];

const schema = [
  {
    width: 170,
    name: 'name',
    displayName: 'Name',
    pinned: 'LEFT',
    get: ({ district }) => ({
      name: district
    })
  },
  {
    width: 100,
    name: 'confirmed',
    displayName: 'Confirmed'
  },
  {
    width: 100,
    name: 'recovered',
    displayName: 'Recovered'
  },
  {
    width: 100,
    name: 'deceased',
    displayName: 'Deaths'
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
    return data.filter((item) => {
      return item.district.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
    });
  };

  return (
    <div className="Detail-container">
      <header>
        <BreadcrumbsWrapper heading={`${params.id}`}>
          <Breadcrumb>
            <div className="Breadcrumb-link">
              <Link onClick={() => history.push(`/`)}>HOME</Link>
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
        <Row group="1" groupXL="2" groupL="2">
          {entity === 'india' && (
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
                    <Heading size="m">{`${params.id} Districts`}</Heading>
                  </div>
                  <Row utilityClass="my-5">
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
                  <div>
                    <Table
                      style={{
                        maxHeight: 'calc(100vh - 50vh)'
                      }}
                      loading={districtLoading || (!districtLoading && !districtData)}
                      buffer={10}
                      rowHeight={40}
                      schema={schema}
                      loaderSchema={loaderSchema}
                      pagination={true}
                      data={getData(districtData ? districtData.district.districtData : [])}
                    />
                  </div>
                </Card>
              </div>
            </Column>
          )}
          <Column>
            {loading && (
              <div className="Spinner-container">
                <Spinner size="large" appearance="primary" />
              </div>
            )}
            {!loading && data && (
              <div style={{ height: '100%', padding: '8px', boxSizing: 'border-box' }}>
                <Summary
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
