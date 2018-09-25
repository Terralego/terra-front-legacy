import React from 'react';
import { Source, Layer } from 'react-mapbox-gl';
import { getIncidencePeriod } from 'helpers/mapFiltersHelpers';

export default ({ sources }) =>
  sources.map(source => (
    <React.Fragment key={source.id}>
      <Source id={source.id} tileJsonSource={source.options} />
      {source.layers.map(layer => (
        <Layer
          key={layer.id}
          type={layer.type}
          sourceId={source.id}
          sourceLayer={layer.sourceLayer}
          id={layer.id}
          paint={layer.paint}
          // TODO: Replace Date.now by activityDate.
          filter={['>=', getIncidencePeriod(Date.now()), 0]}
          layout={layer.layout}
        />
    ))}
    </React.Fragment>
  ));
