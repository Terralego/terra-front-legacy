import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMapboxGl, { Source, Layer } from 'react-mapbox-gl';
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
        <DrawControl {...drawProps} />
      </Map>
    );
  }
}

// TerraDrawMap.propTypes = {
//   mapboxAccessToken: PropTypes.string.isRequired,
//   zoom: PropTypes.number,
//   center: PropTypes.arrayOf(PropTypes.number),
//   addDataDraw: PropTypes.func,
//   deleteDataDraw: PropTypes.func,
//   config: PropTypes.shape({
//     source: {
//       url: PropTypes.string,
//     },
//     vectorLayers: PropTypes.arrayOf(PropTypes.shape({
//       name: PropTypes.string,
//       minZoom: PropTypes.number,
//       minResolution: PropTypes.number,
//       zIndex: PropTypes.number,
//       style: PropTypes.shape({
//         property: PropTypes.name,
//         draw: PropTypes.func,
//       }),
//       type: PropTypes.string,
//       layerName: PropTypes.string,
//     })),
//   }),
//   // sourceVectorOptions: PropTypes.string,
//   // minZoom: PropTypes.number,
//   // maxZoom: PropTypes.number,
//   // maxBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
//   // osmSource: PropTypes.string,
//   // getGeometryOnDrawEnd: PropTypes.func,
//   // getDataOnClick: PropTypes.func,
//   // getDataOnHover: PropTypes.func,
// };

// TerraDrawMap.defaultProps = {
//   zoom: 11,
//   center: [2.62322, 48.40813],
//   addDataDraw: e => e,
//   deleteDataDraw: e => e,
//   config: {
//     source: {
//       url: '',
//       type: 'raster',
//     },
//     vectorLayers: [],
//   },
//   // sourceVectorOptions: '',
//   // minZoom: 11,
//   // maxZoom: 20,
//   // maxBounds: [[2.2917527636, 48.1867854393], [3.1004132613, 48.6260818006]],
//   // osmSource: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//   // getGeometryOnDrawEnd: e => e,
//   // getDataOnClick: e => e,
//   // getDataOnHover: e => e,
// };

export default TerraDrawMap;
