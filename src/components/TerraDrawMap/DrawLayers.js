import React from 'react';
import { GeoJSONLayer } from 'react-mapbox-gl';

export default ({ data, geojsonPaint, editable }) => (
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
            ['!=', 'AUT_CYC', 1], // Remplacer AUT_CYC par le filtre attendu et remplacer 1 par la valeur attendue
          ],
        }}
      />
    }
  </React.Fragment>
);
