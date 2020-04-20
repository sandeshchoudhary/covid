import React, {useState, useEffect, useRef, useCallback} from 'react';
import './App.css';
import Summary from './Summary';
import { Row, Column, Message, Text, Heading } from 'design-system';
import HeatMapIndia from './HeatMaps/India';
import {MAP_META} from './Map/constants';
import axios from 'axios';
import {
  formatDate,
  formatDateAbsolute,
  preprocessTimeseries,
  parseStateTimeseries,
} from './Map/common-functions';
import MapExplorer from './Map';
import CovidInfo from './CovidInfo';

const columnOptions = {
  size: "12",
  sizeXL: "6",
  sizeL: "12",
  sizeM: "6",
  sizeS: "6"
};

const App = () => {
  const [states, setStates] = useState([]);
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
  const [stateTestData, setStateTestData] = useState({});
  const [fetched, setFetched] = useState(false);
  const [graphOption, setGraphOption] = useState(1);
  const [lastUpdated, setLastUpdated] = useState('');
  const [timeseries, setTimeseries] = useState({});
  const [activeStateCode, setActiveStateCode] = useState('TT'); // TT -> India
  const [timeseriesMode, setTimeseriesMode] = useState(true);
  const [timeseriesLogMode, setTimeseriesLogMode] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);
  const [showUpdates, setShowUpdates] = useState(false);

  useEffect(() => {
    if (fetched === false) {
      getStates();
    }
  }, [fetched]);

  const getStates = async () => {
    try {
      const [
        {data},
        stateDistrictWiseResponse,
        {data: statesDailyResponse},
        {data: stateTestData},
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/state_district_wise.json'),
        axios.get('https://api.covid19india.org/states_daily.json'),
        axios.get('https://api.covid19india.org/state_test_data.json'),
      ]);
      setStates(data.statewise);
      // const ts = parseStateTimeseries(statesDailyResponse);
      // ts['TT'] = preprocessTimeseries(data.cases_time_series); // TT -> India
      // setTimeseries(ts);
      setLastUpdated(data.statewise[0].lastupdatedtime);
      const testData = stateTestData.states_tested_data.reverse();
      const totalTest = data.tested[data.tested.length - 1];
      testData.push({
        updatedon: totalTest.updatetimestamp.split(' ')[0],
        totaltested: totalTest.totalindividualstested,
        source: totalTest.source,
        state: 'Total', // India
      });
      setStateTestData(testData);
      setStateDistrictWiseData(stateDistrictWiseResponse.data);
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onHighlightState = (state, index) => {
    if (!state && !index) return setRegionHighlighted(null);
    setRegionHighlighted({state, index});
  };
  const onHighlightDistrict = (district, state, index) => {
    if (!state && !index && !district) return setRegionHighlighted(null);
    setRegionHighlighted({district, state, index});
  };

  const onMapHighlightChange = useCallback(({statecode}) => {
    setActiveStateCode(statecode);
  }, []);

  const refs = [useRef(), useRef(), useRef()];


  return (
    <div className="App">
      <div className="App-body">
        <Row>
          <Column {...columnOptions}>
            <CovidInfo />
          </Column>
          <Column {...columnOptions}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              {fetched && (
                <MapExplorer
                  forwardRef={refs[1]}
                  mapMeta={MAP_META.India}
                  states={states}
                  stateDistrictWiseData={stateDistrictWiseData}
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
            <Summary entity="world" type="world" showLink={true} />
          </Column>
          <Column {...columnOptions}>
            <Summary entity="india" type="country" showLink={true} />
          </Column>
        </Row>
      </div>
    </div>
  );
}

export default App;
