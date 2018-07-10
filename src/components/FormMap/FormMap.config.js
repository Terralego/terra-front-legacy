import settings from 'front-settings';

export const TerraDrawMapConfig = {
  sourceVectorUrl: `${settings.SOURCE_VECTOR_URL}/reference/tiles/{z}/{x}/{y}/`,
  vectorLayers: [],
};

export const mapLegend = [
  { color: '#4ac437', label: 'Ma première légende' },
  { color: '#c0d37b', label: 'Ma seconde légende' },
];

export default {
  TerraDrawMapConfig,
};
