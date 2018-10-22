import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bbox from '@turf/bbox';
import { polygon, lineString, point, featureCollection } from '@turf/helpers';
import ReactMapboxGl from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import MapboxGL from 'mapbox-gl';

import debounce from 'lodash.debounce';

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

const withoutRoutingResult = features => features.filter(feature =>
  feature.geometry.type !== 'LineString' || feature.properties.routeInProgress);

const routingResultOnly = features => features.filter(feature =>
  feature.geometry.type === 'LineString' && !feature.properties.routeInProgress);

class TerraDrawMap extends Component {
  constructor (props) {
    super(props);

    const { mapboxAccessToken: accessToken, maxZoom, minZoom } = props;

    this.Map = ReactMapboxGl({ accessToken, maxZoom, minZoom, preserveDrawingBuffer: true });

    // if there's already features, fit bounds of these
    this.customMapProps = {};
    if (props.features.length) {
      this.customMapProps.fitBounds = bbox(getFeatureCollection(props.features));
    }
    this.state = {
      // https://github.com/alex3165/react-mapbox-gl#why-are-zoom-bearing-and-pitch-arrays-
      zoom: [props.zoom],
      center: props.center,
      isMapboxReady: false,
    };
  }

  shouldComponentUpdate (nextProps, nextState) {
    // TODO: Change this inefficient to an efficient one
    return JSON.stringify(nextProps) !== JSON.stringify(this.props)
      || JSON.stringify(nextState) !== JSON.stringify(this.state);
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

  onMapRender = map => {
    if (!this.map || !this.map.length) {
      this.map = map;
    }
    this.setMapRendered();
  }

  /**
   * Debounce method: know exactly when map has rendered every features needed
   * at init all map render has to be done to get all map methods and more.
  */
  setMapRendered = debounce(() => this.setState({ isMapboxReady: true }), 500);

  setLayerVisibility = (layerId, value) => {
    if (this.map) {
      this.map.setLayoutProperty(layerId, 'visibility', value);
    }
  }

  getLayoutProperty = (layerId, layout) => {
    if (this.state.isMapboxReady && this.map && this.map.length) {
      return this.map.getLayoutProperty(layerId, layout);
    }
    return false;
  }

  mapDidLoad = map => {
    const interactions = [
      'scrollZoom',
      'boxZoom',
      'dragRotate',
      'dragPan',
      'keyboard',
      'doubleClickZoom',
      'touchZoomRotate',
    ];

    this.map = map;
    if (!this.props.onlyMap) {
      this.map.addControl(new MapboxGL.FullscreenControl(), 'top-left');
      this.map.addControl(new MapboxGL.ScaleControl(), 'bottom-left');
    } else {
      interactions.forEach(interaction => this.map[interaction].disable());
    }
    this.map.dragRotate.disable();
  }

  deleteFeatureById (id) {
    this.drawControl.draw.delete([id]);
  }

  initDrawLayer = () => {
    if (this.drawControl && this.drawControl.draw && this.props.editable) {
      this.drawControl.draw.set({
        type: 'FeatureCollection',
        features: withoutRoutingResult(this.props.features),
      });
    }
  }

  render () {
    const {
      mapboxStyle,
      geojsonConflicts,
      showGeojsonConflicts,
      maxBounds,
      onSelectionChange,
      activityFilters,
      config: { drawStyles, sources, geojsonPaint, geojsonConflictsPaint },
      editable,
      features,
      activityDates,
      mapDrawerProps,
      mapProps,
      onlyMap,
    } = this.props;
    // Map component is created in constructor
    const {
      Map,
      onMapRender,
      mapDidLoad,
      customMapProps,
      onDrawChange,
      initDrawLayer,
      setLayerVisibility,
      getLayoutProperty,
    } = this;

    const { zoom, center, isMapboxReady } = this.state;

    return (
      <div className={styles.map}>
        <Map
          {...mapProps}
          style={mapboxStyle}
          containerStyle={{ height: '100%', width: '100%' }}
          fitBoundsOptions={{ padding: 30, maxZoom: 14 }}
          onStyleLoad={mapDidLoad}
          onRender={onMapRender}
          // Center prop need a fixed ref to disable it's render.
          center={center}
          maxBounds={maxBounds}
          // Zoom prop need a fixed ref to disable it's render.
          zoom={zoom}
          {...customMapProps}
        >

          <MapSources sources={sources} activityDates={activityDates} />

          {!editable &&
            <DrawLayers
              data={{
                type: 'FeatureCollection',
                features,
              }}
              geojsonPaint={geojsonPaint}
              filters={activityFilters}
            />
          }

          {editable &&
            <DrawLayers
              data={{
                type: 'FeatureCollection',
                features: routingResultOnly(features),
                // Other features will be drawn by <DrawControl />
              }}
              geojsonPaint={geojsonPaint}
              filters={activityFilters}
            />
          }

          {geojsonConflicts && showGeojsonConflicts &&
            <DrawLayers
              data={geojsonConflicts}
              geojsonPaint={geojsonConflictsPaint}
              filters={activityFilters}
            />
          }

          {editable &&
            <DrawControl
              displayControlsDefault={false}
              styles={drawStyles}
              onDrawUpdate={onDrawChange}
              onDrawCreate={onDrawChange}
              onDrawDelete={onDrawChange}
              onDrawSelectionChange={onSelectionChange}
              controls={{ polygon: true, line_string: true, point: true, trash: true }}
              ref={ref => {
                if (ref && ref.draw) {
                  this.drawControl = ref;
                  initDrawLayer();
                }
              }}
            />
          }
        </Map>

        {isMapboxReady && !onlyMap && <MapDrawer
          {...mapDrawerProps}
          sources={sources}
          filters={activityFilters}
          getLayoutProperty={getLayoutProperty}
          setLayerVisibility={setLayerVisibility}
        />}
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
  activityFilters: PropTypes.array,
  geojsonConflicts: PropTypes.shape({
    features: PropTypes.arrayOf(PropTypes.object),
  }),
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
    geojsonConflictsPaint: PropTypes.object,
  }),
  editable: PropTypes.bool,
  features: PropTypes.array,
  mapDrawerProps: PropTypes.shape({
    expandOnInit: PropTypes.bool,
  }),
  mapProps: PropTypes.object,
  onlyMap: PropTypes.bool,
};

TerraDrawMap.defaultProps = {
  mapboxStyle: 'mapbox://styles/mapbox/streets-v9',
  geojsonConflicts: {
    features: [],
  },
  zoom: 11,
  center: [2.62322, 48.40813],
  onUpdateDataDraw: e => e,
  onDeleteDataDraw: e => e,
  config: {
    drawStyles: [],
    sources: [],
    geojsonPaint: {},
    geojsonConflictsPaint: {},
  },
  editable: true,
  features: [],
  mapProps: {},
  onlyMap: false,
};

export default TerraDrawMap;
