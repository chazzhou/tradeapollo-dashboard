import React, { useEffect } from "react";
import Map, { Source, Layer } from 'react-map-gl';
import { dataLayer } from './map-style';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3p6aHkwMSIsImEiOiJjbHRvdTE4czcwMzhlMmlxb3piN3AyMWRrIn0.Eofj6S2YRnai_qpFhW20Wg'; // Set your mapbox token here

interface MapChartProps {
  year: number;
}

const MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [],
  glyphs: 'fonts/{fontstack}/{range}.pbf',
};

const mapData = "/world.geojson";

const tooltipText = (data: any) => {
  if (!data) {
    return "No data";
  }
  return (
    <div>
      <div>
        <strong>{data["Country/Region"]}</strong>
      </div>
      <div>{data.Data ? `${data.Data} ${data.unit || ""}` : "No data"}</div>
    </div>
  );
};

const MapChart: React.FC<MapChartProps> = ({ year }) => {
  const [data, setData] = React.useState([]);

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

  return (
    <Map
      initialViewState={{
        latitude: 40,
        longitude: -100,
        zoom: 3
      }}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxAccessToken={MAPBOX_TOKEN}
      interactiveLayerIds={['data']}
    >
      <Source type="geojson" data={mapData}>
        <Layer {...dataLayer} />
      </Source>
    </Map>
  );
};

export default MapChart;