import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import settings from 'front-settings';

import { addOrUpdateGeojsonFeature, deleteGeojsonFeature, getIntersections } from 'modules/userrequest';
import { updateConfigValue } from 'modules/appConfig';
import { getActivityFeatures, getDatesQueryOptions } from 'helpers/mapHelper/mapHelper';
import FeaturesList from 'components/FormMap/FeatureList';
import MapDrawButtons from 'components/MapDrawButtons/MapDrawButtons';
import TerraDrawMap from 'components/TerraDrawMap/TerraDrawMap';
import MapLegend from 'components/MapLegend/MapLegend';
import { TerraDrawMapConfig, mapLegend, mapTitleLegend } from 'components/FormMap/FormMap.config';


class FormMap extends Component {
  addDataDraw = data => {
    const { activity: { uid, eventDateStart, eventDateEnd } } = this.props;
    const feature = {
      ...data,
      properties: {
        ...data.properties,
        activity: uid,
        timestampCreatedAt: Date.now(),
        name: data.geometry.type,
      },
    };

    this.props.addOrUpdateGeojsonFeature(feature);
    this.props.getIntersections(feature, eventDateStart, eventDateEnd);
  }

  deleteDataDraw = id => {
    this.props.deleteGeojsonFeature(id);
  }

  deleteFeature = id => {
    this.mapContainer.deleteFeatureById(id);
    this.props.deleteGeojsonFeature(id);
  }

  render () {
    const { features, drawMode, editable, activity, withIncidence } = this.props;
    const activityFeatures = getActivityFeatures(features, activity.uid);

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
              line: 'Tracer un trait',
              point: 'Définir un point',
            }}
            handleChange={mode => this.props.updateConfigValue('drawMode', mode)}
          />
        }
        <Col span={24} lg={24} style={{ height: 450 }}>
          <TerraDrawMap
            mapboxAccessToken={settings.MAPBOX_ACCESS_TOKEN}
            features={activityFeatures}
            config={TerraDrawMapConfig}
            sourceVectorOptions={getDatesQueryOptions(activity.eventDates)}
            minZoom={11}
            maxZoom={17}
            zoom={13}
            center={[2.62322, 48.40813]}
            maxBounds={[[2.2917527636, 48.1867854393], [3.1004132613, 48.6260818006]]}
            ref={el => {
              this.mapContainer = el;
            }}
            addDataDraw={this.addDataDraw}
            deleteDataDraw={this.deleteDataDraw}
            osmSource="https://{a-c}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
          />
          <MapLegend
            title={mapTitleLegend.titleLegend}
            legend={mapLegend}
            style={{ width: 300, position: 'absolute', bottom: 12, right: 18, zIndex: 1 }}
          />
        </Col>
        <Col span={24} lg={24}>
          <Card title={mapTitleLegend.title}>
            <FeaturesList
              features={activityFeatures}
              deleteFeature={this.deleteFeature}
              editable={editable}
              withIncidence={withIncidence}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  drawMode: state.appConfig.drawMode,
  features: ownProps.features || state.userrequest.geojson.features,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateConfigValue,
      addOrUpdateGeojsonFeature,
      deleteGeojsonFeature,
      getIntersections,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(FormMap);
