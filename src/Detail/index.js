import React from 'react';
import { BreadcrumbsWrapper, Breadcrumb, Link } from 'design-system';
import { useHistory, useParams } from "react-router-dom";
import Summary from '../Summary';
import './Detail.css';

const Detail = props => {
  const { entity } = props;
  let history = useHistory();
  const params = useParams();

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
        <Summary entity={params.id} type={entity === 'world' ? 'country' : 'state'} />
      </div>
    </div>
  );
}

export default Detail;
