import React from 'react';
import { BreadcrumbsWrapper, Breadcrumb, Link, Column, Row, Text, Table } from 'design-system';
import { useHistory, useParams } from "react-router-dom";
import Summary from '../Summary';
import './Detail.css';
import HeatMapIndiaState from '../HeatMaps/InidaState';
import axios from 'axios';
const { useEffect, useState } = React;

const columnOptions = {
  size: "12",
  sizeXL: "6",
  sizeL: "12",
  sizeM: "6",
  sizeS: "6"
};

const mapData = data => {
  return Object.entries(data.districtData).map((e) => ( { name: e[0], data:  e[1] } ));
}

const schema = [
  {
    width: 200,
    pinned: false ? 'LEFT' : undefined,
    template: ({ x, rowIndex }) => (
      <div className="Stat-table-cell">
        <Link onClick={() => null}>{x}</Link>
      </div>
    ),
    get: ({ name }) => ({
      x: name,
    }),
    header: () => <div className="Stat-table-cell"><Text weight="strong">Name</Text></div>,
  },
  {
    width: 200,
    pinned: false ? 'LEFT' : undefined,
    template: ({ x, rowIndex }) => (
      <div className="Stat-table-cell">
        {x}
      </div>
    ),
    get: ({ data }) => ({
      x: data.confirmed,
    }),
    header: () => <div className="Stat-table-cell"><Text weight="strong">Confirmed Cases</Text></div>,
  }
]

const Detail = props => {
  const { entity } = props;
  let history = useHistory();
  const params = useParams();
  const stateName = params.id;
  const [stateData, setStateData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    axios(`https://api.covid19india.org/state_district_wise.json`)
      .then(res => {
        setStateData(mapData(res.data[stateName]));
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, [stateName])

  return (
    <div className="Detail-container">
      <header>
        <BreadcrumbsWrapper
          heading={`${params.id} - Breakdown`}
        >
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
            <Summary entity={params.id} type={entity === 'world' ? 'country' : 'state'} />
          </Column>
          { (entity === 'india') && (
            <Column {...columnOptions}>
              <Table
                style={{
                  maxHeight: 'calc(100vh - 222px)',
                  marginLeft: '16px'
                }}
                loadMore={() => null}
                loading={isLoading}
                loadingMoreData={false}
                getGridActions={false ? undefined : undefined}
                buffer={5}
                dynamicRowHeight={false}
                rowHeight={50}
                headerHeight={40}
                virtualization={false}
                schema={schema}
                data={stateData}
              />
            </Column>
          )}
        </Row>
        {/* <div style={{padding: '50px'}}>
          <HeatMapIndiaState state={params.id} />
        </div> */}
      </div>
    </div>
  );
}

export default Detail;
