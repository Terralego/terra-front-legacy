import settings from 'front-settings';

export const TerraDrawMapConfig = {
  sourceVectorUrl: `${settings.SOURCE_VECTOR_URL}/reference/tiles/{z}/{x}/{y}/`,
  vectorLayers: [
    {
      name: 'chemins',
      minZoom: 12,
      zIndex: 2,
      style: {
        property: 'GRIDCODE',
        draw: value => {
          switch (value) {
            case 0:
              return {
                color: 'rgba(255,255,255,.75)',
                width: 1.25,
              };
            case 1:
              return {
                color: 'rgba(255,255,255,.75)',
                width: 1.25,
              };
            case 2:
              return {
                color: 'rgba(255,255,255,.75)',
                width: 1.25,
              };
            case 3:
              return {
                color: 'rgba(255,255,255,.75)',
                width: 1.25,
              };
            case 4:
              return {
                color: 'rgba(255,255,255,.75)',
                width: 1.25,
              };
            default:
              return null;
          }
        },
      },
      type: 'line',
      layerName: 'chemins',
    },
    {
      name: 'hors_chemins',
      minZoom: 12,
      zIndex: 1,
      style: {
        property: 'GRIDCODE',
        draw: value => {
          switch (value) {
            case 0:
              return {
                color: 'rgba(183, 235, 143, .45)', // Green
                width: 1.25,
              };
            case 1:
              return {
                color: 'rgb(255, 229, 143, .45)', // Yellow
                width: 1.25,
              };
            case 2:
              return {
                color: 'rgb(249, 167, 24, .45)', // Dark yellow
                width: 1.25,
              };
            case 3:
              return {
                color: 'rgb(255, 163, 158, .45)', // Red
                width: 1.25,
              };
            case 4:
              return {
                color: 'rgba(182, 21, 12, .45)', // Dark Red
                width: 1.25,
              };
            default:
              return null;
          }
        },
      },
      type: 'polygon',
      layerName: 'hors_chemins',
    },
  ],
};
export const incidenceMessages = {
  parcours: {
    pending: { text: 'Calcul d\'incidence en cours', type: 'warning', color: '#f9a718' },
    0: { text: 'Le niveau d\'incidence du parcours que vous avez choisi n\'a pas d\'incidence sur l\'environnement.', type: 'success', color: '#4ac437' },
    1: { text: 'Le parcours que vous avez tracé se situe dans une zone qui possède un niveau d\'incidence relativement élevé (niveau 1) sur l\'environnement. Des propositions alternatives pourront vous être faites.', type: 'warning', color: '#f9a718' },
    2: { text: 'Le parcours que vous avez tracé se situe dans une zone qui possède un niveau d\'incidence relativement élevé (niveau 2) sur l\'environnement. Des propositions alternatives pourront vous être faites.', type: 'warning', color: '#f9a718' },
    3: { text: 'Le parcours que vous avez tracé se situe dans une zone qui possède un niveau d\'incidence très élevé (niveau 3) sur l\'environnement. Vous avez de fortes chances que votre demande soit refusée. Nous vous recommandons donc un autre tracé.', type: 'error', color: '#ff0c00' },
    4: { text: 'Le parcours que vous avez tracé se situe dans une zone qui possède un niveau d\'incidence très élevé (niveau 4) sur l\'environnement. Pour cette raison, vous ne pouvez pas réaliser l\'activité que vous souhaitez sur cette zone.', type: 'error', color: '#ff0c00' },
  },

  zone: {
    pending: { text: 'Calcul d\'incidence en cours', type: 'warning', color: '#f9a718' },
    0: { text: 'Le niveau d\'incidence de la zone que vous avez choisi n\'a pas d\'incidence sur l\'environnement.', type: 'success', color: '#4ac437' },
    1: { text: 'La zone que vous avez tracée se situe dans une zone qui possède un niveau d\'incidence relativement élevé (niveau 1) sur l\'environnement. Des propositions alternatives pourront vous être faites.', type: 'warning', color: '#f9a718' },
    2: { text: 'La zone que vous avez tracée se situe dans une zone qui possède un niveau d\'incidence relativement élevé (niveau 2) sur l\'environnement. Des propositions alternatives pourront vous être faites.', type: 'warning', color: '#f9a718' },
    3: { text: 'La zone que vous avez tracée se situe dans une zone qui possède un niveau d\'incidence très élevé (niveau 3) sur l\'environnement. Vous avez de fortes chances que votre demande soit refusée. Nous vous recommandons donc un autre tracé.', type: 'error', color: '#ff0c00' },
    4: { text: 'La zone que vous avez tracée se situe dans une zone qui possède un niveau d\'incidence très élevé (niveau 4) sur l\'environnement. Pour cette raison, vous ne pouvez pas réaliser l\'activité que vous souhaitez sur cette zone.', type: 'error', color: '#ff0c00' },
  },
};

export const mapLegend = [
  { color: '#4ac437', label: 'Pas d\'incidence' },
  { color: '#c0d37b', label: 'Relativement élevée (niv 1 ou 2)' },
  { color: '#c4a375', label: 'Très élevée (niv 3)' },
  { color: '#934530', label: 'Très élevée (niv 4), zone non autorisée' },
];

export const publicMessages = {
  1: { text: 'Compte tenu du nombre de personnes participant à votre activité, une étude d\'incidence sera réalisée.' },
};

export default {
  TerraDrawMapConfig,
  incidenceMessages,
  publicMessages,
};
