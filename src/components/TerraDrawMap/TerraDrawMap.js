import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bbox from '@turf/bbox';
import { polygon, lineString, point, featureCollection } from '@turf/helpers';
import ReactMapboxGl, { Source, Layer, GeoJSONLayer } from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import MapboxGL from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import Drawer from 'components/FormMap/Drawer';
import './TerraDrawMap.scss';

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

const handleClick = (map, e) => {
  const featureBbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
  const features = map.queryRenderedFeatures(featureBbox, { layers: ['hors_chemins'] });
  console.log(features);
};

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

  setFilter = filter => () => {
    if (this.map && this.map.getLayer(filter).visibility === 'visible') {
      return this.map.setLayoutProperty(filter, 'visibility', 'none');
    }
    return this.map.setLayoutProperty(filter, 'visibility', 'visible');
  }

  mapDidLoad = map => {
    this.map = map;
    this.map.addControl(new MapboxGL.FullscreenControl(), 'top-left');
    this.map.addControl(new MapboxGL.ScaleControl(), 'bottom-left');
  }

  deleteFeatureById (id) {
    this.drawControl.draw.delete([id]);
  }

  resetDrawMap () {
    if (this.drawControl) {
      this.drawControl.draw.set({
        type: 'FeatureCollection',
        features: this.props.features,
      });
    }
  }

  render () {
    const Map = ReactMapboxGl({
      accessToken: this.props.mapboxAccessToken,
      maxZoom: this.props.maxZoom,
      minZoom: this.props.minZoom,
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
      onClick: handleClick,
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

    return (
      <React.Fragment>
        <Map {...mapProps} onStyleLoad={this.mapDidLoad}>
          {this.props.config.sources.map(source => (
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
                  filter={layer.filter}
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
        <Drawer config={this.props.config} setFilter={this.setFilter} />
      </React.Fragment>
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
