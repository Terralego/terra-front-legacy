import React, { Component } from 'react';
import { Row, Col, Card, Alert } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { updateConfigValue } from 'modules/appConfig';

import MapDrawButtons from 'components/MapDrawButtons/MapDrawButtons';
import TerraDrawMap from 'components/TerraDrawMap/TerraDrawMap';
import MapLegend from 'components/MapLegend/MapLegend';
import { publicMessages, TerraDrawMapConfig, mapLegend } from './FormMap.config';

class FormMap extends Component {
  constructor (props) {
    super(props);
    this.getGeometryOnDrawEnd = this.getGeometryOnDrawEnd.bind(this);
    this.removeFeature = this.removeFeature.bind(this);
  }

  componentDidMount () {
    if (!this.props.editable) {
      this.setDrawMode('pointer');
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.drawMode !== nextProps.drawMode) {
      this.setDrawMode(nextProps.drawMode);
    }
  }

  setDrawMode (mode) {
    switch (mode) {
      case 'pointer':
        this.mapContainer.setSelectionMode();
        break;
      case 'polygon':
        this.mapContainer.startDrawPolygon();
        break;
      case 'line':
        this.mapContainer.startDrawLine();
        break;
      case 'point':
        this.mapContainer.startDrawPoint();
        break;
      default:
        this.mapContainer.unsetSelectionMode();
    }
  }

  getGeometryOnDrawEnd (data) {
    const { activity: { uid } } = this.props;
    const feature = {
      ...data,
      properties: {
        ...data.properties,
        activity: uid,
      },
    };
    this.props.onAddFeature(feature);
  }

  removeFeature (id) {
    this.mapContainer.removeFeatureById(id);
    // this.props.removeRequestFeature(id);
    this.props.onRemoveFeature(id);
  }

  render () {
    const { drawMode, editable } = this.props;

    return (
      <Row gutter={24} style={{ paddingBottom: 24 }}>
        {editable &&
          <MapDrawButtons
            mode={drawMode}
            selectedColor="#578f2b"
            color="#bfbfbf"
            style={{ marginBottom: 16 }}
            showLabel
            labels={{
              pointer: 'Sélection',
              polygon: 'Dessiner une zone',
              line: 'Tracer un parcours',
              point: 'Définir un point',
            }}
            handleChange={mode => this.props.updateConfigValue('drawMode', mode)}
          />
        }
        <Col span={24} lg={24} style={{ height: 450 }}>
          <TerraDrawMap
            features={[]}
            config={TerraDrawMapConfig}
            minZoom={11}
            maxZoom={20}
            zoom={13}
            center={[2.62322, 48.40813]}
            maxBounds={[[2.2917527636, 48.1867854393], [3.1004132613, 48.6260818006]]}
            ref={el => {
              this.mapContainer = el;
            }}
            getGeometryOnDrawEnd={this.getGeometryOnDrawEnd}
            osmSource="https://{a-c}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
          />
          <MapLegend
            title="Niveaux d'incidence"
            legend={mapLegend}
            style={{ width: 300, position: 'absolute', bottom: 12, right: 18, zIndex: 1 }}
          />
        </Col>
        <Col span={24} lg={24}>
          <Card title="Zone de l'activité">
            {this.props.audience >= 300 && (
              <Alert
                message="Remarque"
                description={publicMessages[1].text}
                type="warning"
                showIcon
                style={{ marginBottom: 24 }}
              />
            )}
          </Card>
        </Col>
      </Row>
    );
  }
}

const parseIntOr0 = (inputString, radix = 10) => {
  const parsed = parseInt(inputString, radix);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getAudience = ({ publicCount, participantCount }) =>
  parseIntOr0(publicCount) + parseIntOr0(participantCount);


const StateToProps = (state, ownProps) => ({
  drawMode: state.appConfig.drawMode,
  features: ownProps.features || state.userrequest.geojson.features,
  audience: getAudience(ownProps.activity),
});

const DispatchToProps = dispatch =>
  bindActionCreators(
    { updateConfigValue },
    dispatch,
  );

export default connect(StateToProps, DispatchToProps)(FormMap);
