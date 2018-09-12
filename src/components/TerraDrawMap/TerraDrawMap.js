import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bbox from '@turf/bbox';
import { polygon, lineString, point, featureCollection } from '@turf/helpers';
import ReactMapboxGl from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import MapboxGL from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import 'components/TerraDrawMap/TerraDrawMap.scss';
import styles from 'components/TerraDrawMap/TerraDrawMap.module.scss';

import MapSources from 'components/TerraDrawMap/MapSources';
import DrawLayers from 'components/TerraDrawMap/DrawLayers';
import MapDrawer from 'components/TerraDrawMap/MapDrawer';

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
    this.customMapProps = {};
    if (props.features.length) {
      this.customMapProps.fitBounds = bbox(getFeatureCollection(props.features));
    }
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

  render () {
    const {
      mapboxStyle,
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

    // Map component is created in constructor
    const { Map } = this;

    if (editable) {
      this.setDefaultFilters(activityFilters);
    }

    return (
      <div className={styles.map}>
        <Map
          style={mapboxStyle}
          containerStyle={{ height: '100%', width: '100%' }}
          fitBoundsOptions={{ padding: 30, maxZoom: 14 }}
          onStyleLoad={this.mapDidLoad}
          center={center}
          maxBounds={maxBounds}
          zoom={[zoom]}
          {...this.customMapProps}
        >

          <MapSources sources={sources} />

          <DrawLayers
            editable={editable}
            data={{ type: 'FeatureCollection', features }}
            geojsonPaint={geojsonPaint}
          />

          {editable &&
            <DrawControl
              displayControlsDefault={false}
              styles={drawStyles}
              onDrawUpdate={this.onDrawChange}
              onDrawCreate={this.onDrawChange}
              onDrawDelete={this.onDrawChange}
              onDrawSelectionChange={onSelectionChange}
              controls={{ polygon: true, line_string: true, point: true, trash: true }}
              ref={ref => {
                this.drawControl = ref;
                this.onDrawRender();
              }}
            />
          }
        </Map>

        <MapDrawer
          sources={sources}
          filters={filters}
          setLayerVisibility={this.setLayerVisibility}
        />
      </div>
    );
  }
}

TerraDrawMap.propTypes = {
  mapboxAccessToken: PropTypes.string.isRequired,
  mapboxStyle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
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
  mapboxStyle: 'mapbox://styles/mapbox/streets-v9',
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
