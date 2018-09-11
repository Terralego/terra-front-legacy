import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bbox from '@turf/bbox';
import { polygon, lineString, point, featureCollection } from '@turf/helpers';
import ReactMapboxGl, { Source, Layer, GeoJSONLayer } from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import MapboxGL from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import Drawer from 'components/Drawer/Drawer';
import 'components/TerraDrawMap/TerraDrawMap.scss';
import TerraDrawMapFilters from 'components/TerraDrawMap/TerraDrawMapFilters';
import MapLegend from 'components/MapLegend/MapLegend';
import { mapLegend, mapTitleLegend } from 'components/FormMap/FormMap.config';

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
  constructor (props) {
    super(props);

    const { mapboxAccessToken: accessToken, maxZoom, minZoom } = props;

    this.Map = ReactMapboxGl({ accessToken, maxZoom, minZoom });

    // if there's already features, fit bounds of these
    if (props.features.length) {
      const features = getFeatureCollection(props.features);
      this.bounds = bbox(features);
    }

    this.state = {
      drawerVisibility: true,
    };
  }

  componentDidUpdate () {
    this.resetDrawMap();
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

  setLayerVisibility = (layerId, value) => {
    if (this.map) {
      this.map.setLayoutProperty(layerId, 'visibility', value);
    }
  }

  setDefaultFilters (filters = []) {
    const { config: { sources }, FiltersValue } = this.props;

    sources.forEach(source => {
      source.layers.forEach(layer => {
        if (!Object.values(FiltersValue).includes(layer.id)) {
          this.setLayerVisibility(layer.id, 'none');
        }
      });
    });
    filters.forEach(filter => {
      this.setLayerVisibility(filter, 'visible');
    });
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
      const editableFeatures = this.props.features.filter(feature =>
        feature.geometry.type !== 'LineString' || feature.properties.routeInProgress);
      // this.drawControl.draw.deleteAll();
      this.drawControl.draw.set({
        type: 'FeatureCollection',
        features: editableFeatures,
      });
    }
  }

  toggleDrawerVisibility = () =>
    this.setState({ drawerVisibility: !this.state.drawerVisibility });

  render () {
    const {
      center,
      zoom,
      maxBounds,
      onSelectionChange,

      activityFilters,
      config: { drawStyles, sources, geojsonPaint },
      editable,
      features,
      filters,
    } = this.props;

    const mapProps = {
      style: 'mapbox://styles/mapbox/streets-v9',
      containerStyle: {
        height: '100%',
        width: '100%',
      },
      center,
      maxBounds,
      zoom: [zoom],
      fitBoundsOptions: { padding: 30, maxZoom: 14 },
    };

    if (this.bounds) {
      mapProps.fitBounds = this.bounds;
    }

    const drawProps = {
      displayControlsDefault: false,
      styles: drawStyles,
      controls: {
        polygon: true,
        line_string: true,
        point: true,
        trash: true,
      },
      onDrawUpdate: this.onDrawChange,
      onDrawCreate: this.onDrawChange,
      onDrawDelete: this.onDrawChange,
      onDrawSelectionChange: onSelectionChange,
      ref: drawControl => {
        this.drawControl = drawControl;
        this.onDrawRender();
      },
    };

    const { Map } = this;

    if (editable) {
      this.setDefaultFilters(activityFilters);
    }

    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        <Map {...mapProps} onStyleLoad={this.mapDidLoad}>
          {sources.map(source => (
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
                  layout={layer.layout}
                />
            ))}
            </React.Fragment>
          ))}

          {/* Draw features */}
          {!editable &&
            <React.Fragment>
              <GeoJSONLayer
                data={{ type: 'FeatureCollection', features }}
                fillPaint={geojsonPaint.fillPaint}
                linePaint={geojsonPaint.linePaint}
                layerOptions={{
                  filter: ['==', '$type', 'Polygon'],
                }}
              />

              <GeoJSONLayer
                data={{ type: 'FeatureCollection', features }}
                circlePaint={geojsonPaint.circlePaint}
                layerOptions={{
                  filter: ['==', '$type', 'Point'],
                }}
              />

              <GeoJSONLayer
                data={{ type: 'FeatureCollection', features }}
                linePaint={geojsonPaint.linePaint}
                layerOptions={{
                  filter: ['==', '$type', 'LineString'],
                }}
              />
            </React.Fragment>
          }


          {/* Routing features */}
          {editable &&
            <GeoJSONLayer
              data={{ type: 'FeatureCollection', features }}
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
            <DrawControl {...drawProps} />
          }
        </Map>
        <Drawer
          id="map-drawer"
          visible={this.state.drawerVisibility}
          handleVisibilityToggle={this.toggleDrawerVisibility}
        >
          <MapLegend
            title={mapTitleLegend.titleLegend}
            legend={mapLegend}
          />
          {sources.map(source => (
            <TerraDrawMapFilters
              key={`${source.id}_filters`}
              source={source}
              setLayerVisibility={this.setLayerVisibility}
              filters={filters}
            />
          ))}
        </Drawer>
      </div>
    );
  }
}

TerraDrawMap.propTypes = {
  mapboxAccessToken: PropTypes.string.isRequired,
  FiltersValue: PropTypes.objectOf(PropTypes.string),
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
  FiltersValue: {
    OFF_PATHS: 'hors_chemins',
    PATHS: 'chemins',
  },
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
