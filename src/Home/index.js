import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../App.css';
import Summary from '../Summary';
import { Row, Column, Spinner } from 'design-system';
import { MAP_META } from '../Map/constants';
import query from '../query';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { formatDate, formatDateAbsolute, preprocessTimeseries, parseStateTimeseries } from '../Map/common-functions';
import MapExplorer from '../Map';
import CovidInfo from '../CovidInfo';
import './Home.css';

const mapColumnOptions = {
  size: '12',
  sizeXL: '8',
  sizeL: '12',
  sizeM: '8',
  sizeS: '8'
};

const infoColumnOptions = {
  size: '12',
  sizeXL: '4',
  sizeL: '12',
  sizeM: '4',
  sizeS: '4'
};

const Home = () => {
  let history = useHistory();
  const refs = [useRef(), useRef(), useRef()];

  const [states, setStates] = useState([]);
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
  const [stateTestData, setStateTestData] = useState({});
  const [indiaStats, setIndiaStats] = useState({});
  const [lastUpdated, setLastUpdated] = useState('');
  const [activeStateCode, setActiveStateCode] = useState('TT'); // TT -> India
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);
  const [fetched, setFetched] = useState(false);

  const { loading, error, data } = useQuery(query.indiaStats);

  useEffect(() => {
    if (!loading && data) {
      setStates(data.india.statewise);
      setLastUpdated(data.india.statewise[0].lastupdatedtime);
      const testData = data.tests.reverse();
      const totalTest = data.india.tested[data.india.tested.length - 1];
      testData.push({
        updatedon: totalTest.updatetimestamp.split(' ')[0],
        totaltested: totalTest.totalindividualstested,
        source: totalTest.source,
        state: 'Total' // India
      });
      setStateTestData(testData);
      setStateDistrictWiseData(data.districts);
      const index = data.india.statewise.findIndex((item) => {
        return item.state === 'Total';
      });
      setIndiaStats(data.india.statewise[index]);
      setFetched(true);
    }
  }, [loading]);

  const onMapHighlightChange = useCallback(({ statecode }) => {
    setActiveStateCode(statecode);
  }, []);

  const paddingClass = window.innerWidth <= 769 ? 'px-4' : 'px-10';

  return (
    <div className={`py-6 ${paddingClass} Home`}>
      <Row>
        <Column {...mapColumnOptions}>
          <div style={{ padding: '0 16px' }}>
            {fetched && (
              <MapExplorer
                forwardRef={refs[1]}
                mapMeta={MAP_META.India}
                states={states}
                stateDistrictWiseDataV2={stateDistrictWiseData}
                stateTestData={stateTestData}
                regionHighlighted={regionHighlighted}
                onMapHighlightChange={onMapHighlightChange}
                isCountryLoaded={true}
              />
            )}
          </div>
        </Column>
        <Column {...infoColumnOptions}>
          <div style={{ padding: '0 16px' }}>
            <CovidInfo />
          </div>
        </Column>
      </Row>
    </div>
  );
};

export default Home;
