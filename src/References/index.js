import React from 'react';
import './References.css';
import { useHistory } from 'react-router-dom';
import { BreadcrumbsWrapper, Breadcrumb, Link, Heading, Table, Text } from '@innovaccer/design-system';

const schema = [
  {
    width: 300,
    template: ({ x, rowIndex }) => (
      <div className="Stat-table-cell">
        <Text>{x}</Text>
      </div>
    ),
    get: ({ name }) => ({
      x: name
    }),
    name: 'name',
    displayName: 'Name'
  },
  {
    width: 300,
    template: ({ x, rowIndex }) => (
      <div className="Stat-table-cell">
        <Link href={x} target="_blank">
          {x}
        </Link>
      </div>
    ),
    get: ({ link }) => ({
      x: link
    }),
    name: 'link',
    displayName: 'Link'
  }
];

const data = [
  {
    name: 'World Health Organization (WHO)',
    link: 'https://www.who.int/'
  },
  {
    name: 'COVID19-India API',
    link: 'https://api.covid19india.org/'
  },
  {
    name: 'COVID19-India',
    link: 'https://www.covid19india.org/'
  }
];

const References = () => {
  let history = useHistory();

  return (
    <div className="References-container">
      <BreadcrumbsWrapper heading="References">
        <Breadcrumb>
          <div className="Breadcrumb-link">
            <Link onClick={() => history.push(`/`)}>Home</Link>
          </div>
        </Breadcrumb>
      </BreadcrumbsWrapper>
      <div className="References-table">
        <Heading>Data Sources</Heading>
        <Table
          schema={schema}
          data={data}
          limit={14}
          style={{
            maxHeight: 'calc(100vh - 252px)'
          }}
          loadMore={() => null}
        />
      </div>
    </div>
  );
};

export default References;
