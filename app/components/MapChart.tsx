import React, { useCallback, useEffect, useMemo } from "react";
import Map, { Source, Layer } from 'react-map-gl';
import { countiesLayer, highlightLayer } from './map-style';
import { hasFlag } from 'country-flag-icons'
import * as flags from 'country-flag-icons/react/3x2';

interface CountryFlagProps extends React.ComponentProps<'div'> {
  countryCode: string;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ countryCode, ...props }) => {
  const FlagComponent = flags[countryCode as keyof typeof flags];

  if (!FlagComponent) {
    return null; // or render a default flag or placeholder
  }

  return <FlagComponent {...props as React.ComponentProps<typeof FlagComponent>} />;
};

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3p6aHkwMSIsImEiOiJjbHRvdTE4czcwMzhlMmlxb3piN3AyMWRrIn0.Eofj6S2YRnai_qpFhW20Wg'; // Set your mapbox token here

interface MapChartProps {
  year: number;
}

const mapData = "/world.geojson";

const MapChart: React.FC<MapChartProps> = ({ year }) => {
  const [data, setData] = React.useState([]);
  const [hoverInfo, setHoverInfo] = React.useState<any>(null);
  const selectedElectricityZone = (hoverInfo && hoverInfo.feature.properties.zoneName) || '';
  const filter = useMemo(() => ['==', ['get', 'zoneName'], selectedElectricityZone], [selectedElectricityZone]);

  useEffect(() => {
    fetch(`/co2_data/${year}.json`)
      .then((response) => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`);
          return;
        }
        response.json().then((worldData) => {
          setData(worldData);
        });
      })
      .catch((err) => {
        console.log("Fetch Error :-S", err);
      });
  }, [year]);

  const onHover = useCallback((event: any) => {
    const {
      features,
      point: {x, y}
    } = event;
    const hoveredFeature = features && features[0];

    // prettier-ignore
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y, 
                                    countyName: hoveredFeature.properties.countryKey});
  }, []);

  return (
    <Map
      initialViewState={{
        latitude: 40,
        longitude: -100,
        zoom: 3
      }}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxAccessToken={MAPBOX_TOKEN}
      interactiveLayerIds={['counties']}
      onMouseMove={onHover}
    >
      <Source type="geojson" data={mapData}>
        <Layer {...countiesLayer} />
        <Layer beforeId="waterway-label" {...highlightLayer} filter={filter} />
      </Source>
      {hoverInfo && (
        <div className="tooltip" style={{left: (hoverInfo as any).x, top: (hoverInfo as any).y}}>
          <div className="flex flex-row justify-start space-x-1 items-center">
            {hasFlag((hoverInfo as any).feature.properties.countryKey) && (
              <CountryFlag countryCode={(hoverInfo as any).feature.properties.countryKey} className="max-w-3" />
            )}
            <div>{(hoverInfo as any).feature.properties.countryName}</div>
          </div>
          <div>Electricity Zone: {(hoverInfo as any).feature.properties.zoneName}</div>
        </div>
      )}
    </Map>
  );
};

export default MapChart;