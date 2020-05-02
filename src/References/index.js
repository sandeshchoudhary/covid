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
        <Link>{x}</Link>
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
    name: 'DXY.cn. Pneumonia. 2020.',
    link: 'http://3g.dxy.cn/newh5/view/pneumonia'
  },
  {
    name: 'BNO News',
    link: 'https://bnonews.com/index.php/2020/02/the-latest-coronavirus-cases/'
  },
  {
    name: 'National Health Commission of the People’s Republic of China (NHC)',
    link: 'http://www.nhc.gov.cn/xcs/yqtb/list_gzbd.shtml'
  },
  {
    name: 'China CDC (CCDC)',
    link: 'http://weekly.chinacdc.cn/news/TrackingtheEpidemic.htm'
  },
  {
    name: 'Hong Kong Department of Health',
    link: 'https://www.chp.gov.hk/en/features/102465.html'
  },
  {
    name: 'Macau Government',
    link: 'https://www.ssm.gov.mo/portal/'
  },
  {
    name: 'Taiwan CDC',
    link: 'https://sites.google.com/cdc.gov.tw/2019ncov/taiwan?authuser=0'
  },
  {
    name: 'US CDC',
    link: 'https://www.cdc.gov/coronavirus/2019-ncov/index.html'
  },
  {
    name: 'Government of Canada',
    link: 'https://www.canada.ca/en/public-health/services/diseases/coronavirus.html'
  },
  {
    name: 'Australia Government Department of Health',
    link: 'https://www.health.gov.au/news/coronavirus-update-at-a-glance'
  },
  {
    name: 'European Centre for Disease Prevention and Control (ECDC)',
    link: 'https://www.ecdc.europa.eu/en/geographical-distribution-2019-ncov-cases'
  },
  {
    name: 'Ministry of Health Singapore (MOH)',
    link: 'https://www.moh.gov.sg/covid-19'
  },
  {
    name: 'Italy Ministry of Health',
    link: 'http://www.salute.gov.it/nuovocoronavirus'
  },
  {
    name: '1Point3Arces',
    link: 'https://coronavirus.1point3acres.com/en'
  },
  {
    name: 'WorldoMeters',
    link: 'https://www.worldometers.info/coronavirus/'
  },
  {
    name: 'COVID Tracking Project',
    link: 'https://covidtracking.com/data'
  },
  {
    name: 'NDTV Covid-19 Data',
    link: 'https://edata.ndtv.com/cricket/coronavirus/data.json'
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
