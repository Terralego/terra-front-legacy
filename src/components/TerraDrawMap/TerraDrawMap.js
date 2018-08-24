import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bbox from '@turf/bbox';
import { polygon, lineString, point, featureCollection } from '@turf/helpers';
import ReactMapboxGl, { Source, Layer, GeoJSONLayer } from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

/**
 * getFeatureCollection returns an array of feature for turf
 * @param {array} features : array of features
 * @returns featureCollection
 */
const getFeatureCollection = features => featureCollection(features.map(feature => {
  if (feature.geometry.type === 'LineString') {
    return lineString(feature.geometry.coordinates);
  }
  if (feature.geometry.type === 'Point') {
    return point(feature.geometry.coordinates);
  }
  return polygon(feature.geometry.coordinates);
}));

class TerraDrawMap extends Component {
  shouldComponentUpdate () {
    return false;
  }

  componentWillUnmount () {
    this.resetDrawMap();
  }

  onDrawChange = e => {
    if (
      e.action === 'move' ||
      e.type === 'draw.create' ||
      e.action === 'change_coordinates'
    ) {
      this.props.onUpdateDataDraw(e.features);
    } else if (
      e.type === 'draw.delete'
    ) {
      this.props.onDeleteDataDraw(e.features);
    }
  }

  onDrawRender = () => {
    if (this.drawControl && this.props.editable) {
      this.drawControl.draw.set({
        type: 'FeatureCollection',
        features: this.props.features,
      });
    }
  }

  resetDrawMap () {
    if (this.drawControl) {
      this.drawControl.draw.set({
        type: 'FeatureCollection',
        features: this.props.features,
      });
    }
  }

  deleteFeatureById (id) {
    this.drawControl.draw.delete([id]);
  }

  render () {
    const Map = ReactMapboxGl({
      accessToken: this.props.mapboxAccessToken,
    });

    const mapProps = {
      style: 'mapbox://styles/mapbox/streets-v9',
      containerStyle: {
        height: '100%',
        width: '100%',
      },
      center: this.props.center,
      zoom: [this.props.zoom],
      maxBounds: this.props.maxBounds,
    };

    // If map contains features, center on it
    if (this.props.features.length) {
      const features = getFeatureCollection(this.props.features);
      const bounds = bbox(features);
      mapProps.fitBounds = bounds;
    }

    const drawProps = {
      displayControlsDefault: false,
      styles: this.props.config.drawStyles,
      controls: {
        polygon: true,
        line_string: true,
        point: true,
        trash: true,
      },
      onDrawUpdate: this.onDrawChange,
      onDrawCreate: this.onDrawChange,
      onDrawDelete: this.onDrawChange,
      onDrawSelectionChange: this.props.onSelectionChange,
      ref: drawControl => {
        this.drawControl = drawControl;
        this.onDrawRender();
      },
    };

    const filter = {
      all: ['!=', '', ''],
      hasIncidence: ['==', 'GRIDCODE', '0'] || ['==', 'GRIDCODE', '1'] || ['==', 'GRIDCODE', '2'],
      hasRoutes: ['!=', 'geom', '1255'],
    };
    return (
      <Map {...mapProps}>
        {this.props.config.sources.map(source => (
          <React.Fragment key={source.id}>
            <Source id={source.id} tileJsonSource={source.options} />
            {source.layers.map(layer => (
              <Layer
                key={layer.id}
                type={layer.type}
                sourceId={source.id}
                sourceLayer={layer.id}
                id={layer.id}
                paint={layer.paint}
                filter={filter.hasRoutes}
                // filter={['!=', 'GRIDCODE', 2]}
                // filter={['all', ['==', 'GRIDCODE', 1] || ['==', 'GRIDCODE', 2]]}
              />
           ))}
          </React.Fragment>
        ))}

        {!this.props.editable &&
          <React.Fragment>
            <GeoJSONLayer
              data={{ type: 'FeatureCollection', features: this.props.features }}
              fillPaint={this.props.config.geojsonPaint.fillPaint}
              linePaint={this.props.config.geojsonPaint.linePaint}
              layerOptions={{
                filter: ['==', '$type', 'Polygon'],
              }}
            />

            <GeoJSONLayer
              data={{ type: 'FeatureCollection', features: this.props.features }}
              circlePaint={this.props.config.geojsonPaint.circlePaint}
              layerOptions={{
                filter: ['==', '$type', 'Point'],
              }}
            />

            <GeoJSONLayer
              data={{ type: 'FeatureCollection', features: this.props.features }}
              linePaint={this.props.config.geojsonPaint.linePaint}
              layerOptions={{
                filter: ['==', '$type', 'LineString'],
              }}
            />
          </React.Fragment>
        }

        {this.props.editable &&
          <DrawControl {...drawProps} />
        }
      </Map>
    );
  }
}

TerraDrawMap.propTypes = {
  mapboxAccessToken: PropTypes.string.isRequired,
  zoom: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number),
  onUpdateDataDraw: PropTypes.func,
  onDeleteDataDraw: PropTypes.func,
  config: PropTypes.shape({
    drawStyles: PropTypes.array,
    sources: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      options: PropTypes.shape({
        type: PropTypes.string,
        tiles: PropTypes.arrayOf(PropTypes.string),
      }),
      layers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
        paint: PropTypes.any,
      })),
    })),
    geojsonPaint: PropTypes.object,
  }),
  editable: PropTypes.bool,
  features: PropTypes.array,
};

TerraDrawMap.defaultProps = {
  zoom: 11,
  center: [2.62322, 48.40813],
  onUpdateDataDraw: e => e,
  onDeleteDataDraw: e => e,
  config: {
    drawStyles: [],
    sources: [],
    geojsonPaint: {},
  },
  editable: true,
  features: [],
};

export default TerraDrawMap;
