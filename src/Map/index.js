import React, {useState, useEffect, useMemo, useCallback} from 'react';
import ChoroplethMap from './choropleth';
import {MAP_TYPES, MAP_META} from './constants';
import {formatDate, formatDateAbsolute, formatNumber} from './common-functions';
import {formatDistance, format, parse} from 'date-fns';
import { Heading, Message, Row, Column, Button, Subheading } from 'design-system';
import './Map.css';

const getRegionFromState = (state) => {
  if (!state) return;
  const region = {...state};
  if (!region.name) region.name = region.state;
  return region;
};

const getRegionFromDistrict = (districtData, name) => {
  if (!districtData) return;
  const region = {...districtData};
  if (!region.name) region.name = region.district;
  return region;
};

const getStateData = (states, name) => {
  const index = states.findIndex(item => {
    return item.state === name;
  });
  return index > -1 ? states[index] : null;
}

const getDistrictData = (districts, name) => {
  const index = districts.findIndex(item => {
    return item.district === name;
  });
  return index > -1 ? districts[index] : null;
}

function MapExplorer({
  forwardRef,
  mapMeta,
  states,
  stateDistrictWiseDataV2,
  stateTestData,
  regionHighlighted,
  onMapHighlightChange,
  isCountryLoaded,
}) {
  const [selectedRegion, setSelectedRegion] = useState({});
  const [panelRegion, setPanelRegion] = useState(getRegionFromState(states[0]));
  const [currentHoveredRegion, setCurrentHoveredRegion] = useState(
    getRegionFromState(states[0])
  );
  const [testObj, setTestObj] = useState({});
  const [currentMap, setCurrentMap] = useState(mapMeta);

  const [statistic, currentMapData] = useMemo(() => {
    const statistic = {total: 0, maxConfirmed: 0};
    let currentMapData = {};

    if (currentMap.mapType === MAP_TYPES.COUNTRY) {
      currentMapData = states.reduce((acc, state) => {
        if (state.state === 'Total') {
          return acc;
        }
        const confirmed = parseInt(state.confirmed);
        statistic.total += confirmed;
        if (confirmed > statistic.maxConfirmed) {
          statistic.maxConfirmed = confirmed;
        }

        acc[state.state] = state.confirmed;
        return acc;
      }, {});
      console.log(currentMapData);
    } else if (currentMap.mapType === MAP_TYPES.STATE) {
      const districtWiseData = (
        getStateData(stateDistrictWiseDataV2, currentMap.name) || {districtData: {}}
      ).districtData;

      currentMapData = districtWiseData.reduce((acc, district) => {
        const confirmed = parseInt(district.confirmed);
        statistic.total += confirmed;
        if (confirmed > statistic.maxConfirmed) {
          statistic.maxConfirmed = confirmed;
        }
        acc[district.district] = district.confirmed;
        return acc;
      }, {});
    }
    return [statistic, currentMapData];
  }, [currentMap, states, stateDistrictWiseDataV2]);

  const setHoveredRegion = useCallback(
    (name, currentMap) => {
      if (currentMap.mapType === MAP_TYPES.COUNTRY) {
        const region = getRegionFromState(
          states.find((state) => name === state.state)
        );
        setCurrentHoveredRegion(region);
        setPanelRegion(region);
        onMapHighlightChange(region);
      } else if (currentMap.mapType === MAP_TYPES.STATE) {
        
        const state = getStateData(stateDistrictWiseDataV2, currentMap.name) || {districtData: {}};
        let districtData = getDistrictData(state.districtData, name);
        if (!districtData) {
          districtData = {
            confirmed: 0,
            active: 0,
            deaths: 0,
            recovered: 0,
          };
        }
        // console.log(districtData, name)
        setCurrentHoveredRegion(getRegionFromDistrict(districtData, name));
        const panelRegion = getRegionFromState(
          states.find((state) => currentMap.name === state.state)
        );
        setPanelRegion(panelRegion);
        if (onMapHighlightChange) onMapHighlightChange(panelRegion);
      }
    },
    [states, stateDistrictWiseDataV2, onMapHighlightChange]
  );

  useEffect(() => {
    if (regionHighlighted === undefined || regionHighlighted === null) return;

    const isState = !('district' in regionHighlighted);
    if (isState) {
      const newMap = MAP_META['India'];
      setCurrentMap(newMap);
      const region = getRegionFromState(regionHighlighted.state);
      setHoveredRegion(region.name, newMap);
      setSelectedRegion(region.name);
    } else {
      const newMap = MAP_META[regionHighlighted.state.state];
      if (!newMap) {
        return;
      }
      setCurrentMap(newMap);
      setHoveredRegion(regionHighlighted.district, newMap);
      setSelectedRegion(regionHighlighted.district);
    }
  }, [regionHighlighted, setHoveredRegion]);

  const switchMapToState = useCallback(
    (name) => {
      const newMap = MAP_META[name];
      if (!newMap) {
        return;
      }
      setCurrentMap(newMap);
      setSelectedRegion(null);
      if (newMap.mapType === MAP_TYPES.COUNTRY) {
        setHoveredRegion(states[0].state, newMap);
      } else if (newMap.mapType === MAP_TYPES.STATE) {
        const {districtData} = getStateData(stateDistrictWiseDataV2, name) || {};
        const topDistrict = districtData
          .filter((district) => district.district !== 'Unknown')
          .sort((a, b) => {
            return b.confirmed - a.confirmed;
            })[0];
        setHoveredRegion(topDistrict.district, newMap);
        setSelectedRegion(topDistrict.district);
      }
    },
    [setHoveredRegion, stateDistrictWiseDataV2, states]
  );

  const {name, lastupdatedtime} = currentHoveredRegion;

  useEffect(() => {
    setTestObj(
      stateTestData.find(
        (obj) => obj.state === panelRegion.name && obj.totaltested !== ''
      )
    );
  }, [panelRegion, stateTestData, testObj]);

  return (
    <div
      className="MapExplorer fadeInUp"
      style={{animationDelay: '1.5s'}}
      ref={forwardRef}
    >
      
      <div className="Map-header">
        <Heading size="l">{currentMap.name} Map</Heading>
        <Subheading appearance="subtle" size="m">
          {window.innerWidth <= 769 ? 'Tap' : 'Hover'} over a{' '}
            {currentMap.mapType === MAP_TYPES.COUNTRY ? 'state/UT' : 'district'}{' '}
            for more details
        </Subheading>
      </div>

      <div className="Map-stats">
        <div className="Map-stats-item fadeInUp" style={{animationDelay: '2s'}}>
          <h5>{window.innerWidth <= 769 ? 'Cnfmd' : 'Confirmed'}</h5>
          <div className="stats-bottom">
            <h1>{formatNumber(panelRegion.confirmed)}</h1>
            <h6>{}</h6>
          </div>
        </div>

        <div
          className="Map-stats-item Map-stats-item--blue fadeInUp"
          style={{animationDelay: '2.1s'}}
        >
          <h5>{window.innerWidth <= 769 ? 'Actv' : 'Active'}</h5>
          <h1>{formatNumber(panelRegion.active)}</h1>
        </div>

        <div
          className="Map-stats-item Map-stats-item--green fadeInUp"
          style={{animationDelay: '2.2s'}}
        >
          <h5>{window.innerWidth <= 769 ? 'Rcvrd' : 'Recovered'}</h5>
          <h1>{formatNumber(panelRegion.recovered)}</h1>
        </div>

        <div
          className="Map-stats-item Map-stats-item--gray fadeInUp"
          style={{animationDelay: '2.3s'}}
        >
          <h5>{window.innerWidth <= 769 ? 'Dcsd' : 'Deceased'}</h5>
          <h1>{formatNumber(panelRegion.deaths)}</h1>
        </div>

          <div
            className="Map-stats-item Map-stats-item--purple tested fadeInUp"
            style={{animationDelay: '2.4s'}}
          >
            <h5>{window.innerWidth <= 769 ? 'Tested' : 'Tested'}</h5>
            <h1>
              {formatNumber(testObj?.totaltested, window.innerWidth <= 769)}
            </h1>
            <h6 className="timestamp">
              {!isNaN(parse(testObj?.updatedon, 'dd/MM/yyyy', new Date()))
                ? `As of ${format(
                    parse(testObj?.updatedon, 'dd/MM/yyyy', new Date()),
                    'dd MMM'
                  )}`
                : ''}
            </h6>
            {/* {testObj?.totaltested?.length > 1 && (
              <a href={testObj.source} target="_noblank">
                <Icon.Link />
              </a>
            )} */}
          </div>
      </div>

      <div className="Map-meta fadeInUp" style={{animationDelay: '2.4s'}}>
        <h2>{name}</h2>
        {lastupdatedtime && (
          <div
            className={`Map-meta-last-update ${
              currentMap.mapType === MAP_TYPES.STATE
                ? 'district-last-update'
                : 'state-last-update'
            }`}
          >
            <h6>Last updated</h6>
            <h3
              title={
                isNaN(Date.parse(formatDate(lastupdatedtime)))
                  ? ''
                  : formatDateAbsolute(lastupdatedtime)
              }
            >
              {isNaN(Date.parse(formatDate(lastupdatedtime)))
                ? ''
                : formatDistance(
                    new Date(formatDate(lastupdatedtime)),
                    new Date()
                  ) + ' ago'}
            </h3>
          </div>
        )}

        {currentMap.mapType === MAP_TYPES.STATE &&
        currentHoveredRegion.name !== currentMap.name ? (
          <h1 className="district-confirmed">
            {currentMapData[currentHoveredRegion.name]
              ? currentMapData[currentHoveredRegion.name]
              : 0}
            <br />
            <span style={{fontSize: '0.75rem', fontWeight: 600}}>
              confirmed
            </span>
          </h1>
        ) : null}

        {currentMap.mapType === MAP_TYPES.STATE &&
        currentMapData.Unknown > 0 ? (
          <h4 className="unknown">
            Districts unknown for {currentMapData.Unknown} people
          </h4>
        ) : null}

        {currentMap.mapType === MAP_TYPES.STATE ? (
          <Button appearance="basic" size="tiny" onClick={() => switchMapToState('India')}>
            Back
          </Button>
        ) : null}
      </div>

      <ChoroplethMap
        statistic={statistic}
        mapMeta={currentMap}
        mapData={currentMapData}
        setHoveredRegion={setHoveredRegion}
        changeMap={switchMapToState}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        isCountryLoaded={isCountryLoaded}
      />
    </div>
  );
}

export default MapExplorer;