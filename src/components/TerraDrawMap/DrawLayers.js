import React from 'react';
import { GeoJSONLayer } from 'react-mapbox-gl';

export default ({ data, geojsonPaint, editable, filters }) => {
  const authorisations = filters[0].replace('chemins_', '');
  return (
    <React.Fragment>
      {/* Draw features */}
      {!editable &&
        <React.Fragment>
          <GeoJSONLayer
            data={data}
            fillPaint={geojsonPaint.fillPaint}
            linePaint={geojsonPaint.linePaint}
            layerOptions={{ filter: ['==', '$type', 'Polygon'] }}
          />

          <GeoJSONLayer
            data={data}
            circlePaint={geojsonPaint.circlePaint}
            layerOptions={{ filter: ['==', '$type', 'Point'] }}
          />

          <GeoJSONLayer
            data={data}
            linePaint={geojsonPaint.linePaint}
            layerOptions={{ filter: ['==', '$type', 'LineString'] }}
          />
        </React.Fragment>
      }

      {/* Routing features */}
      {editable &&
        <GeoJSONLayer
          data={data}
          linePaint={geojsonPaint.routedLinePaint}
          layerOptions={{
            filter: [
              'all',
              ['==', '$type', 'LineString'],
              ['==', 'routeInProgress', false],
            ],
          }}
        />
      }
      {editable &&
        <GeoJSONLayer
          data={data}
          linePaint={geojsonPaint.routedLinePaintForbidden}
          layerOptions={{
            filter: [
              'all',
              ['==', '$type', 'LineString'],
              ['==', 'routeInProgress', false],
              ['==', authorisations, 0], // Check if path is forbidden, Forbidden = 0.
            ],
          }}
        />
      }
    </React.Fragment>
  );
};
