import React from 'react';
import { Spinner } from 'design-system';
import { 
  ComposableMap, Geographies, Geography , ZoomableGroup, Marker
} from 'react-simple-maps';

const topoMapping = require('./topoMapping.json');

const PROJECTION_CONFIG = {
  scale: 350,
  center: [78.9629, 22.5937]
};

const DEFAULT_COLOR = '#f9e2e2';


// const geoUrl =
//   "https://raw.githubusercontent.com/shklnrj/IndiaStateTopojsonFiles/master/Rajasthan.topojson"

  const HeatMapIndiaState = (props) => {
    const { state } = props;
    const geoUrl = topoMapping[state].url;
    console.log(geoUrl)
    if (!geoUrl) return null;

    return (
        <ComposableMap projectionConfig={PROJECTION_CONFIG} projection="geoMercator"
          width={450}
          height={200}
        >
          {/* <ZoomableGroup zoom={1}> */}
          <Geographies geography={geoUrl}>
            {({geographies}) => geographies.map(geo => {
              return (
                <Geography key={geo.rsmKey} geography={geo}
                  fill="green"
                />
              )
            }
            )}
          </Geographies>
          {/* </ZoomableGroup> */}
        </ComposableMap>
      
    )
  }

export default HeatMapIndiaState;