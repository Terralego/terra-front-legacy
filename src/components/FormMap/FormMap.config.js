import settings from 'front-settings';

export const terraDrawMapConfig = {
  sourceVectorUrl: `${settings.SOURCE_VECTOR_URL}/reference/tiles/{z}/{x}/{y}/`,
  vectorLayers: [],
};

export const terraDrawMapProps = {
  center: [2.62322, 48.40813],
  maxBounds: [[2.2917527636, 48.1867854393], [3.1004132613, 48.6260818006]],
  minZoom: 8,
  maxZoom: 21,
  zoom: 13,
};

export const mapLegend = [
  { color: '#4ac437', label: 'Ma première légende' },
  { color: '#c0d37b', label: 'Ma seconde légende' },
];
export const LegendComponent = null;

export const mapTitleLegend = {
  title: 'Carte',
  titleLegend: 'Légende',
};

export default {
  terraDrawMapConfig,
};
