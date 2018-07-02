import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ol from 'openlayers';
import 'openlayers/dist/ol.css';

function guid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

const getLayerStyle = (layer, feature) => {
  const sameLayerName = feature.getProperties().layer === layer.layerName;
  const layerStyle = layer.style.draw(feature.get(layer.style.property));
  if (layer.type === 'line' && sameLayerName) {
    return new ol.style.Style({
      stroke: new ol.style.Stroke(layerStyle),
    });
  } else if (layer.type === 'polygon' && sameLayerName) {
    return new ol.style.Style({
      fill: new ol.style.Fill(layerStyle),
    });
  }
  return null;
};

class TerraDrawMap extends Component {
  componentDidMount () {
    const sourceLayer = new ol.layer.Tile({
      source: new ol.source.OSM({
        url: this.props.osmSource,
      }),
    });
    this.sourceDraw = new ol.source.Vector({ wrapX: false });
    if (this.props.features.length) {
      this.sourceDraw
        .addFeatures((new ol.format.GeoJSON({
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        })).readFeatures({
          type: 'FeatureCollection',
          features: this.props.features,
        }));
    }
    this.vectorDraw = new ol.layer.Vector({
      source: this.sourceDraw,
      zIndex: 100,
      style (feature) {
        if (feature.getGeometry().getType() === 'Point') {
          return new ol.style.Style({
            image: new ol.style.Circle({
              radius: 5,
              fill: new ol.style.Fill({
                color: 'rgba(0,132,255,0.25)',
              }),
              stroke: new ol.style.Stroke({
                color: '#0084ff',
                width: 1.8,
              }),
            }),
          });
        }
        return new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(0,132,255,0.25)',
          }),
          stroke: new ol.style.Stroke({
            color: '#0084ff',
            width: 1.8,
          }),
        });
      },
    });

    const vectorLayers = this.initVectorTilesLayer();

    const view = new ol.View({
      center: ol.proj.fromLonLat(this.props.center),
      zoom: this.props.zoom,
      minZoom: this.props.minZoom,
      maxZoom: this.props.maxZoom,
      extent: [
        ol.proj.fromLonLat(this.props.maxBounds[0]),
        ol.proj.fromLonLat(this.props.maxBounds[1]),
      ]
        .toString()
        .split(','),
    });

    this.map = new ol.Map({
      controls: ol.control
        .defaults({
          attributionOptions: {
            collapsible: false,
          },
        })
        .extend([]),
      target: this.mapContainer,
      layers: [sourceLayer, this.vectorDraw, ...vectorLayers],
      view,
    });

    // this.modify = new ol.interaction.Modify({ source: this.sourceDraw });
    this.select = new ol.interaction.Select({ source: this.sourceDraw });
    // this.snap = new ol.interaction.Snap({ source: this.sourceDraw });

    if (this.props.getDataOnHover) {
      this.map.on('pointermove', this.onHover, this);
    }

    if (this.props.getDataOnClick) {
      this.map.on('click', this.onClick, this);
    }

    this.sourceDraw.on('addfeature', event => {
      if (this.props.getGeometryOnDrawEnd && !event.feature.id) {
        const id = guid();
        this.props.getGeometryOnDrawEnd({
          type: 'Feature',
          geometry: {
            type: event.feature.getGeometry().getType(),
            coordinates: event.feature.getGeometry().transform('EPSG:3857', 'EPSG:4326').getCoordinates(),
          },
          properties: {
            id,
            name: event.feature.getGeometry().getType(),
          },
        });
        event.feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
        event.feature.setId(id);
      }
    });
  }

  componentDidUpdate (prevProps) {
    if (this.props.sourceVectorOptions !== prevProps.sourceVectorOptions) {
      // Get existing layers if any
      const layers = this.map && this.map.getLayers().getArray();

      this.props.config.vectorLayers.forEach(vectorLayer => {
        layers.forEach(layer => {
          if (layer.get('name') === vectorLayer.name) {
            layer.setSource(this.getVectorLayerSource());
          }
        });
      });
    }
  }

  onHover (event) {
    // TODO: Mouse move events should be limited by throttling

    const layerFilter = layerCandidate => {
      const layerCandidateName = layerCandidate.get('name');
      return this.props.config.vectorLayers.find(layer => layer.name === layerCandidateName);
    };

    const features = this.map.getFeaturesAtPixel(event.pixel, { layerFilter });

    if (features) {
      this.props.getDataOnHover(features[0].getProperties());
    }
  }

  onClick (event) {
    const features = this.map.getFeaturesAtPixel(event.pixel, {
      layerFilter: e =>
        this.props.config.vectorLayers
          .map(a => a.name)
          .indexOf(e.get('name')) !== -1,
    });

    if (features) {
      this.props.getDataOnClick(features[0].getProperties());
    }
  }

  setSelectionMode () {
    this.stopDraw();
    // this.map.addInteraction(this.modify);
    this.map.addInteraction(this.select);
    // this.map.addInteraction(this.snap);
  }

  getVectorLayerSource () {
    return new ol.source.VectorTile({
      format: new ol.format.MVT(),
      url: `${this.props.config.sourceVectorUrl}${this.props.sourceVectorOptions}`,
      renderMode: 'hybrid',
    });
  }

  initVectorTilesLayer () {
    const vectorLayers = [];

    const getVectorLayer = layer => new ol.layer.VectorTile({
      id: `${layer.name}_${this.props.sourceVectorOptions}`,
      name: layer.name,
      maxResolution: 156543.03392804097 / (2 ** (layer.minZoom - 1)),
      source: this.getVectorLayerSource(),
      zIndex: layer.zIndex ? layer.zIndex : 1,
      style: feature => getLayerStyle(layer, feature),
    });

    this.props.config.vectorLayers.forEach(data => {
      const vectorLayer = getVectorLayer(data);
      vectorLayers.push(vectorLayer);
    });

    return vectorLayers;
  }

  unsetSelectionMode () {
    this.map.removeInteraction(this.select);
    // this.map.removeInteraction(this.modify);
    // this.map.removeInteraction(this.snap);
  }

  stopDraw () {
    if (this.draw) {
      this.map.removeInteraction(this.draw);
    }
  }

  startDrawPolygon () {
    this.stopDraw();
    this.unsetSelectionMode();

    this.draw = new ol.interaction.Draw({
      source: this.sourceDraw,
      type: 'Polygon',
    });

    this.map.addInteraction(this.draw);
  }

  startDrawLine () {
    this.stopDraw();
    this.unsetSelectionMode();

    this.draw = new ol.interaction.Draw({
      source: this.sourceDraw,
      type: 'LineString',
    });

    this.map.addInteraction(this.draw);
  }

  startDrawPoint () {
    this.stopDraw();
    this.unsetSelectionMode();

    this.draw = new ol.interaction.Draw({
      source: this.sourceDraw,
      type: 'Point',
    });

    this.map.addInteraction(this.draw);
  }

  removeFeatureById (id) {
    this.sourceDraw.forEachFeature(feature => {
      if (feature.getId() === id) {
        this.sourceDraw.removeFeature(feature);
      }
    });
  }

  render () {
    return (
      <div
        style={{ height: '100%', width: '100%' }}
        ref={el => {
          this.mapContainer = el;
        }}
      />
    );
  }
}

TerraDrawMap.propTypes = {
  config: PropTypes.shape({
    sourceVectorUrl: PropTypes.string,
    vectorLayers: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      minZoom: PropTypes.number,
      zIndex: PropTypes.number,
      style: PropTypes.shape({
        property: PropTypes.name,
        draw: PropTypes.func,
      }),
      type: PropTypes.string,
      layerName: PropTypes.string,
    })),
  }),
  sourceVectorOptions: PropTypes.string,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  zoom: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number),
  maxBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  osmSource: PropTypes.string,
  getGeometryOnDrawEnd: PropTypes.func,
  getDataOnClick: PropTypes.func,
  getDataOnHover: PropTypes.func,
};

TerraDrawMap.defaultProps = {
  config: { sourceVectorUrl: '', vectorLayers: [] },
  sourceVectorOptions: '',
  minZoom: 11,
  maxZoom: 20,
  zoom: 11,
  center: [2.62322, 48.40813],
  maxBounds: [[2.2917527636, 48.1867854393], [3.1004132613, 48.6260818006]],
  osmSource: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  getGeometryOnDrawEnd: e => e,
  getDataOnClick: e => e,
  getDataOnHover: e => e,
};

export default TerraDrawMap;
