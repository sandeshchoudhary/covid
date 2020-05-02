import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ChoroplethMap from './choropleth';
import { MAP_TYPES, MAP_META } from './constants';
import { formatDate, formatDateAbsolute, formatNumber } from './common-functions';
import { formatDistance, format, parse } from 'date-fns';
import { Heading, Message, Row, Column, Button, Subheading, Card, Text } from '@innovaccer/design-system';
import './Map.css';

const mapColumnOptions = {
  size: '12',
  sizeXL: '8',
  sizeL: '8',
  sizeM: '8'
};

const infoColumnOptions = {
  size: '12',
  sizeXL: '4',
  sizeL: '4',
  sizeM: '4'
};

const getRegionFromState = (state) => {
  if (!state) return;
  const region = { ...state };
  if (!region.name) region.name = region.state;
  return region;
};

const getRegionFromDistrict = (districtData, name) => {
  if (!districtData) return;
  const region = { ...districtData };
  if (!region.name) region.name = region.district;
  return region;
};

const getStateData = (states, name) => {
  const index = states.findIndex((item) => {
    return item.state === name;
  });
  return index > -1 ? states[index] : null;
};

const getDistrictData = (districts, name) => {
  const index = districts.findIndex((item) => {
    return item.district === name;
  });
  return index > -1 ? districts[index] : null;
};

function MapExplorer({
  forwardRef,
  mapMeta,
  states,
  stateDistrictWiseDataV2,
  stateTestData,
  regionHighlighted,
  onMapHighlightChange,
  isCountryLoaded
}) {
  const [selectedRegion, setSelectedRegion] = useState({});
  const [panelRegion, setPanelRegion] = useState(getRegionFromState(states[0]));
  const [currentHoveredRegion, setCurrentHoveredRegion] = useState(getRegionFromState(states[0]));
  const [testObj, setTestObj] = useState({});
  const [currentMap, setCurrentMap] = useState(mapMeta);

  const [statistic, currentMapData] = useMemo(() => {
    const statistic = { total: 0, maxConfirmed: 0 };
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
    } else if (currentMap.mapType === MAP_TYPES.STATE) {
      const districtWiseData = (getStateData(stateDistrictWiseDataV2, currentMap.name) || { districtData: {} })
        .districtData;

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
        const region = getRegionFromState(states.find((state) => name === state.state));
        setCurrentHoveredRegion(region);
        setPanelRegion(region);
        onMapHighlightChange(region);
      } else if (currentMap.mapType === MAP_TYPES.STATE) {
        const state = getStateData(stateDistrictWiseDataV2, currentMap.name) || { districtData: {} };
        let districtData = getDistrictData(state.districtData, name);
        if (!districtData) {
          districtData = {
            confirmed: 0,
            active: 0,
            deaths: 0,
            recovered: 0
          };
        }

        setCurrentHoveredRegion(getRegionFromDistrict(districtData, name));
        const panelRegion = getRegionFromState(states.find((state) => currentMap.name === state.state));
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
        const { districtData } = getStateData(stateDistrictWiseDataV2, name) || {};
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

  const { name, lastupdatedtime } = currentHoveredRegion;

  useEffect(() => {
    setTestObj(stateTestData.find((obj) => obj.state === panelRegion.name && obj.totaltested !== ''));
  }, [panelRegion, stateTestData, testObj]);

  console.log(currentMap.mapType);

  return (
    <Card
      shadow="light"
      style={{
        minHeight: '200px',
        padding: '16px',
        backgroundColor: 'white'
      }}
    >
      <Row>
        <Column {...mapColumnOptions}>
          <Heading size="m">{currentMap.name} Map</Heading>
          <Subheading appearance="subtle" size="s">
            {window.innerWidth <= 769 ? 'Tap' : 'Hover'} over a{' '}
            {currentMap.mapType === MAP_TYPES.COUNTRY ? 'state/UT' : 'district'} for more details
          </Subheading>
          {currentMap.mapType === MAP_TYPES.STATE ? (
            <Button appearance="basic" size="tiny" onClick={() => switchMapToState('India')}>
              Back
            </Button>
          ) : null}
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
        </Column>
        <Column {...infoColumnOptions}>
          <Text weight="strong">{name}</Text>
          <div className="Map-info">
            <div className="Map-info-item py-4 px-5">
              <div>
                <div className="InfoLegend InfoLegend--alert"></div>
                <Text>Confirmed</Text>
              </div>
              <div className="pt-3 pl-5">
                {currentMap.mapType === MAP_TYPES.COUNTRY && (
                  <Text style={{ fontSize: '28px' }}>{formatNumber(panelRegion.confirmed)}</Text>
                )}
                {currentMap.mapType === MAP_TYPES.STATE && (
                  <Text style={{ fontSize: '28px' }}>{formatNumber(currentHoveredRegion.confirmed)}</Text>
                )}
              </div>
            </div>
            <div className="Map-info-item py-4 px-5">
              <div>
                <div className="InfoLegend InfoLegend--primary"></div>
                <Text>Active</Text>
              </div>
              <div className="pt-3 pl-5">
                {currentMap.mapType === MAP_TYPES.COUNTRY ? (
                  <Text style={{ fontSize: '28px' }}>{formatNumber(panelRegion.active)}</Text>
                ) : (
                  '-'
                )}
              </div>
            </div>
            <div className="Map-info-item py-4 px-5">
              <div>
                <div className="InfoLegend InfoLegend--success"></div>
                <Text>Recovered</Text>
              </div>
              <div className="pt-3 pl-5">
                {currentMap.mapType === MAP_TYPES.COUNTRY ? (
                  <Text style={{ fontSize: '28px' }}>{formatNumber(panelRegion.recovered)}</Text>
                ) : (
                  '-'
                )}
              </div>
            </div>
            <div className="Map-info-item py-4 px-5">
              <div>
                <div className="InfoLegend InfoLegend--secondary"></div>
                <Text>Deceased</Text>
              </div>
              <div className="pt-3 pl-5">
                {currentMap.mapType === MAP_TYPES.COUNTRY ? (
                  <Text style={{ fontSize: '28px' }}>{formatNumber(panelRegion.deaths)}</Text>
                ) : (
                  '-'
                )}
              </div>
            </div>
            <div className="Map-info-item py-4 px-5">
              <div>
                <div className="InfoLegend InfoLegend--warning"></div>
                <Text>Tested</Text>
                {currentMap.mapType === MAP_TYPES.COUNTRY && (
                  <Text style={{ float: 'right' }}>
                    {!isNaN(parse(testObj?.updatedon, 'dd/MM/yyyy', new Date()))
                      ? `As of ${format(parse(testObj?.updatedon, 'dd/MM/yyyy', new Date()), 'dd MMM')}`
                      : ''}
                  </Text>
                )}
              </div>
              <div className="pt-3 pl-5">
                {currentMap.mapType === MAP_TYPES.COUNTRY ? (
                  <Text style={{ fontSize: '28px' }}>{testObj ? formatNumber(testObj.totaltested) : '-'}</Text>
                ) : (
                  '-'
                )}
              </div>
            </div>
          </div>
          {lastupdatedtime && (
            <div className="mt-8">
              <Text appearance="subtle" small={true}>
                Last updated
              </Text>
              <br />
              <Text>
                {isNaN(Date.parse(formatDate(lastupdatedtime)))
                  ? ''
                  : formatDistance(new Date(formatDate(lastupdatedtime)), new Date()) + ' ago'}
              </Text>
            </div>
          )}
        </Column>
      </Row>
    </Card>
  );
}

export default MapExplorer;
