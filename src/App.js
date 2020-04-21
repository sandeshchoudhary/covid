import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import StatsCard from './Summary';
import { Row, Column, Spinner } from 'design-system';
import { MAP_META } from './Map/constants';
import query from './query';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { formatDate, formatDateAbsolute, preprocessTimeseries, parseStateTimeseries } from './Map/common-functions';
import MapExplorer from './Map';
import CovidInfo from './CovidInfo';

const columnOptions = {
  size: '12',
  sizeXL: '6',
  sizeL: '12',
  sizeM: '6',
  sizeS: '6'
};

const App = () => {
  const { loading: districtLoading, error: districtError, data: districtData } = useQuery(query.districts);
  const { loading: indiaLoading, error: indiaError, data: indiaData } = useQuery(query.india);
  const { loading: testLoading, error: testError, data: testingData } = useQuery(query.tests);
  const { loading: worldLoading, error: worldError, data: worldData } = useQuery(query.world);
  const [states, setStates] = useState([]);
  const [stateDistrictWiseDataV2, setStateDistrictWiseDataV2] = useState({});
  const [stateTestData, setStateTestData] = useState({});
  const [indiaStats, setIndiaStats] = useState({});
  const [fetched, setFetched] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [activeStateCode, setActiveStateCode] = useState('TT'); // TT -> India
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);

  let history = useHistory();

  useEffect(() => {
    if (
      !indiaLoading &&
      !indiaError &&
      indiaData &&
      !testLoading &&
      !testError &&
      testingData &&
      !districtLoading &&
      !districtError &&
      districtData
    ) {
      setStates(indiaData.india.statewise);
      setLastUpdated(indiaData.india.statewise[0].lastupdatedtime);
      const testData = testingData.tests.reverse();
      const totalTest = indiaData.india.tested[indiaData.india.tested.length - 1];
      testData.push({
        updatedon: totalTest.updatetimestamp.split(' ')[0],
        totaltested: totalTest.totalindividualstested,
        source: totalTest.source,
        state: 'Total' // India
      });
      setStateTestData(testData);
      setStateDistrictWiseDataV2(districtData.districts);
      const index = indiaData.india.statewise.findIndex((item) => {
        return item.state === 'Total';
      });
      setIndiaStats(indiaData.india.statewise[index]);
      setFetched(true);
    }
  });

  const getWorldStats = (data) => {
    const stats = {
      ...data,
      ...{
        active: data.confirmed - data.deaths - data.recovered
      }
    };
    return stats;
  };

  const onHighlightState = (state, index) => {
    if (!state && !index) return setRegionHighlighted(null);
    setRegionHighlighted({ state, index });
  };
  const onHighlightDistrict = (district, state, index) => {
    if (!state && !index && !district) return setRegionHighlighted(null);
    setRegionHighlighted({ district, state, index });
  };

  const onMapHighlightChange = useCallback(({ statecode }) => {
    setActiveStateCode(statecode);
  }, []);

  const refs = [useRef(), useRef(), useRef()];

  const drillIndiaCallback = () => {
    history.push('/india');
  };

  const drillWorldCallback = () => {
    history.push('/world');
  };

  return (
    <div className="App">
      <div className="App-body">
        <Row>
          <Column {...columnOptions}>
            <CovidInfo />
          </Column>
          <Column {...columnOptions}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {fetched && (
                <MapExplorer
                  forwardRef={refs[1]}
                  mapMeta={MAP_META.India}
                  states={states}
                  stateDistrictWiseDataV2={stateDistrictWiseDataV2}
                  stateTestData={stateTestData}
                  regionHighlighted={regionHighlighted}
                  onMapHighlightChange={onMapHighlightChange}
                  isCountryLoaded={true}
                />
              )}
            </div>
          </Column>
        </Row>
        <Row>
          <Column {...columnOptions}>
            {worldLoading && (
              <div className="Spinner-container">
                <Spinner size="large" appearance="primary" />
              </div>
            )}
            {!worldLoading && !worldError && worldData && (
              <StatsCard
                entity="world"
                showLink={true}
                stats={getWorldStats(worldData.summary)}
                drillCallback={drillWorldCallback}
              />
            )}
          </Column>
          <Column {...columnOptions}>
            {!fetched && (
              <div className="Spinner-container">
                <Spinner size="large" appearance="primary" />
              </div>
            )}
            {fetched && (
              <StatsCard entity="india" showLink={true} stats={indiaStats} drillCallback={drillIndiaCallback} />
            )}
          </Column>
        </Row>
      </div>
    </div>
  );
};

export default App;
