import React from 'react';
import { Spinner } from 'design-system';
import { 
  ComposableMap, Geographies, Geography , ZoomableGroup, Marker
} from 'react-simple-maps';
import query, {getQuery} from '../../query';
import { useQuery } from '@apollo/react-hooks';
const statesMapping = require('./statesMapping.json');
const latLong = require('./latLong.json');

const PROJECTION_CONFIG = {
  scale: 350,
  center: [78.9629, 22.5937]
};

const getHeatMapData = data => {
  const {states} = data;
  const list = states.map(state => {
    state.id = statesMapping[state.name];
    return state;
  });
  return list;
}

const DEFAULT_COLOR = '#f9e2e2';

const colorStyle = (value, total) => {
  const percent = (value/total) * 100;
    if (percent <= 2) return '#f9e2e2';
    if (percent > 2 && percent <=4) return '#f7ada5';
    if (percent > 4 && percent <= 8) return '#eb776c';
    if (percent > 8 && percent <= 10) return '#d93737';
    if (percent > 10 && percent <= 20) return '#9c2828';
    return '#631919';
}

const geoUrl =
  "https://rawgit.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json"

  const HeatMapIndia = (props) => {
    const { loading, error, data } = useQuery(query.stats.india);
    const { loading : statsLoading, error : statsError, data: statsData } = useQuery(getQuery('country', 'india'));
    console.log(statsData)
    if (loading || statsLoading) {
      return (
        <div className="Spinner-container">
          <Spinner size="large" appearance="primary" />
        </div>
      );
    }
    if (error || statsError) {
      return null;
    }
    const mapData = getHeatMapData(data);

    return (
      <div>
          <ComposableMap projectionConfig={PROJECTION_CONFIG} projection="geoMercator"
        width={450}
        height={200}>
          {/* <ZoomableGroup zoom={1}> */}
            <Geographies geography={geoUrl}>
              {({geographies}) => geographies.map(geo => {
                const current = mapData.find(s => s.id === geo.id);
                return (
                  <Geography key={geo.rsmKey} geography={geo}
                    fill={current ? colorStyle(current.mostRecent.confirmed, statsData.country.mostRecent.confirmed) : DEFAULT_COLOR}
                  />
                )
              }
              
              )}
            </Geographies>
          {/* {latLong.states.map(({ name, coordinates, markerOffset }) => (
            <Marker key={name} coordinates={coordinates}>
              <circle r={2} fill="#F00" stroke="#fff" strokeWidth={2} />
              <text
                textAnchor="middle"
                y={markerOffset}
                style={{ fill: "#5D5A6D", fontSize: '8px' }}
              >
                {name}
              </text>
            </Marker>
          ))} */}
          {/* </ZoomableGroup> */}
          </ComposableMap>
        </div>
    )
  }

export default HeatMapIndia;