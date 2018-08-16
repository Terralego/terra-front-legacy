import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMapboxGl, { Source, Layer, GeoJSONLayer } from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

class TerraDrawMap extends Component {
  shouldComponentUpdate () {
    return false;
  }

  onDrawChange = e => {
    if (
      e.action === 'move' ||
      e.type === 'draw.create' ||
      e.action === 'change_coordinates'
    ) {
      this.props.addDataDraw(e.features[0]);
    } else if (
      e.type === 'draw.delete'
    ) {
      this.props.deleteDataDraw(e.features[0].id);
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

    const drawProps = {
      displayControlsDefault: false,
      controls: {
        polygon: true,
        line_string: true,
        point: true,
        trash: true,
      },
      onDrawUpdate: this.onDrawChange,
      onDrawCreate: this.onDrawChange,
      onDrawDelete: this.onDrawChange,
      ref: drawControl => { this.drawControl = drawControl; },
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
              />
            ))}
          </React.Fragment>
        ))}

        <GeoJSONLayer
          data={{
            type: 'FeatureCollection',
            features: this.props.features,
          }}
          {...this.props.config.geojsonPaint}
        />

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
  addDataDraw: PropTypes.func,
  deleteDataDraw: PropTypes.func,
  config: PropTypes.shape({
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
  addDataDraw: e => e,
  deleteDataDraw: e => e,
  config: {
    sources: [],
    geojsonPaint: {},
  },
  editable: true,
  features: [],
};

export default TerraDrawMap;
