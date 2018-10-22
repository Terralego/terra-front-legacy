import React from 'react';
import { Source, Layer } from 'react-mapbox-gl';
import { drawStyles } from 'components/FormMap/FormMap.config';
import { getIncidencePeriods } from 'helpers/incidencePeriodHelpers';

export default ({ sources, activityDates = [], onSourceLoaded }) => {
  const incidences = getIncidencePeriods(activityDates);
  const getter = Object.keys(incidences).map(i => ['get', i]);

  return sources.map(source => (
    <React.Fragment key={source.id}>
      <Source
        id={source.id}
        tileJsonSource={source.options}
        onSourceLoaded={src => onSourceLoaded(src.map)}
      />
      {source.layers.map(layer => (
        <Layer
          key={layer.id}
          type={layer.type}
          sourceId={source.id}
          sourceLayer={layer.sourceLayer}
          id={layer.id}
          filter={layer.filter}
          paint={
            layer.id === 'hors_chemins' && activityDates.length
            ? {
              'fill-opacity': 0.4,
              'fill-color':
                ['match',
                  ['max', ...getter],
                  0, drawStyles.green45,
                  1, drawStyles.yellow45,
                  2, drawStyles.darkYellow45,
                  3, drawStyles.red45,
                  4, drawStyles.darkRed45,
                  'transparent',
                ],
              }
            : layer.paint
          }
          layout={layer.layout}
        />
      ))}
    </React.Fragment>
  ));
};
