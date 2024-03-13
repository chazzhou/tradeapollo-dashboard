import type {FillLayer} from 'react-map-gl';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const countiesLayer: FillLayer = {
  id: 'counties',
  type: 'fill',
  paint: {
    'fill-outline-color': 'rgba(0,0,0,0.1)',
    'fill-color': 'rgba(0,0,0,0.1)'
  }
};
// Highlighted county polygons
export const highlightLayer: FillLayer = {
  id: 'counties-highlighted',
  type: 'fill',
  source: 'counties',
  paint: {
    'fill-outline-color': '#484896',
    'fill-color': '#627bc1',
    'fill-opacity': 0.75
  }
};