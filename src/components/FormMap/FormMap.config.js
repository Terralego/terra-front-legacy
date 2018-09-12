import settings from 'front-settings';

export const terraDrawMapConfig = {
  sourceVectorUrl: `${settings.SOURCE_VECTOR_URL}/reference/tiles/{z}/{x}/{y}/`,
  vectorLayers: [],
};

export const mapLegend = [
  { color: '#4ac437', label: 'Ma première légende' },
  { color: '#c0d37b', label: 'Ma seconde légende' },
];

export const mapTitleLegend = {
  title: 'Carte',
  titleLegend: 'Légende',
};

export default {
  terraDrawMapConfig,
};
