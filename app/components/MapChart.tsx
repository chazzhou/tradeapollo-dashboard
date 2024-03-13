import React, { useCallback, useRef, useMemo } from "react";
import Map, { MapRef, Source, Layer } from 'react-map-gl';
import { countiesLayer, highlightLayer } from './map-style';
import { hasFlag } from 'country-flag-icons'
import * as flags from 'country-flag-icons/react/3x2';
import { AnimatePresence } from 'framer-motion';
import FeaturePanel from "./FeaturePanel";
import * as turf from '@turf/turf'

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
const mapData = "/world.geojson";

const MapChart: React.FC = () => {
  const mapRef = useRef<MapRef>(null);
  const [hoverInfo, setHoverInfo] = React.useState<any>(null);
  const selectedElectricityZone = (hoverInfo && hoverInfo.feature.properties.zoneName) || '';
  const filter = useMemo(() => ['==', ['get', 'zoneName'], selectedElectricityZone], [selectedElectricityZone]);
  const [clickedFeature, setClickedFeature] = React.useState<any>(null);

  const onHover = useCallback((event: any) => {
    const { features, point: {x, y} } = event;
    const hoveredFeature = features && features[0]; // prettier-ignore
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y, countyName: hoveredFeature.properties.countryKey});
  }, []);

  const onClick = useCallback((event: any) => {
    const {
      features,
      point: { x, y },
    } = event;
    const clickedFeature = features && features[0];
    if (clickedFeature) {
      setClickedFeature(clickedFeature);

      // calculate the bounding box of the feature
      const [minLng, minLat, maxLng, maxLat] = turf.bbox(clickedFeature);

      if (mapRef.current) {
        mapRef.current.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat]
          ],
          {padding: 40, duration: 1000}
        );
      }
    }
  }, []);

  const handleClosePanelClick = () => {
    setClickedFeature(null);
  };

  return (
    <>
      <div style={{ height: '100%', width: '100%' }}>
        <Map
          ref={mapRef}
          initialViewState={{
            latitude: 48,
            longitude: 15,
            zoom: 4
          }}
          style={{ height: '100%', width: '100%' }}
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
          interactiveLayerIds={['counties']}
          onMouseMove={onHover}
          onClick={onClick}
        >
          <Source type="geojson" data={mapData}>
            <Layer {...countiesLayer} />
            <Layer beforeId="waterway-label" {...highlightLayer} filter={filter} />
          </Source>
          {hoverInfo && (
            <div className="tooltip" style={{left: (hoverInfo as any).x, top: (hoverInfo as any).y}}>
              <div className="flex flex-row justify-start space-x-1 items-center">
                {hasFlag((hoverInfo as any).feature.properties.countryKey) && (
                  <CountryFlag
                    countryCode={(hoverInfo as any).feature.properties.countryKey}
                    className="max-w-3"
                  />
                )}
                <div>{(hoverInfo as any).feature.properties.countryName}</div>
              </div>
              <div>Electricity Zone: {(hoverInfo as any).feature.properties.zoneName}</div>
            </div>
          )}
        </Map>
      </div>
      <AnimatePresence>
        {clickedFeature && (
          <FeaturePanel feature={clickedFeature} onClose={handleClosePanelClick} />
        )}
      </AnimatePresence>
    </>
  );
};

export default MapChart;