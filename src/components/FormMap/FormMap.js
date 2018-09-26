import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import settings from 'front-settings';

import { updateConfigValue } from 'modules/appConfig';
import { getFeatureWithProperties, getActivityFeatures } from 'helpers/mapHelpers';
import { getFeatureById } from 'helpers/userrequestHelpers';
import FeaturesList from 'components/FormMap/FeatureList';
import TerraDrawMap from 'components/TerraDrawMap/TerraDrawMap';
import { terraDrawMapConfig, mapTitleLegend } from 'components/FormMap/FormMap.config';

class FormMap extends Component {
  state = {
    selectedFeaturesId: [],
  };

  onSelectionChange = e => {
    this.setState({ selectedFeaturesId: e.features.map(feature => feature.id) });
  }

  /**
   * handleUpdateDataDraw add or update features
   * - get all needed properties (dates, activity id, timestamp, etc).
   * - call intersection request to get incidence
   * @param {array} features
   *
   * @memberof FormMap
   */
  handleUpdateDataDraw = features => {
    features.forEach(feature => {
      const { activity: { uid } } = this.props;
      const featureWithProperties = getFeatureWithProperties(feature, uid);
      this.props.updateFeatures(featureWithProperties);
    });
  }

  /**
   * Handle on delete feature(s) on map
   * - delete feature from TerraDrawMap
   * - call props function onDeleteDataDraw
   * - Filter selectedFeaturesId from state to remove deleted features
   * @param {array} features array of features deleted by TerraDrawMap
   *
   * @memberof FormMap
   */
  handleDeleteDataDraw = features => {
    const { relatedFeature, featuresId } = features.reduce((acc, feature) => ({
      relatedFeature: feature.properties.relatedFeatureId
        ? getFeatureById(this.props.features, feature.properties.relatedFeatureId)
        : acc.relatedFeatures,
      featuresId: [...acc.featuresId, feature.id],
    }), { relatedFeature: null, featuresId: [] });

    this.props.deleteFeaturesById(featuresId);
    if (relatedFeature) {
      this.mapContainer.deleteFeatureById(relatedFeature.properties.id);
    }
    this.setState({ selectedFeaturesId: [] });
  }

  /**
   * Handle on click on feature list item
   * @param {string} featureId
   *
   * @memberof FormMap
   */
  deleteDrawData = id => {
    this.props.deleteFeaturesById([id]);
    this.mapContainer.deleteFeatureById(id);
    this.setState({
      selectedFeaturesId: [],
    });
  }

  render () {
    const {
      features,
      editable, activity,
      withIncidence,
      activityFilters,
      FiltersValue,
    } = this.props;
    const activityFeatures = getActivityFeatures(features, activity.uid);
    const featureList = activityFeatures.filter(feature => !feature.properties.routeInProgress);

    return (
      <Row gutter={24} style={{ paddingBottom: 24 }}>
        <Col span={24} lg={24} style={{ height: 450, overflow: 'hidden', position: 'relative' }}>
          <TerraDrawMap
            mapboxAccessToken={settings.MAPBOX_ACCESS_TOKEN}
            features={activityFeatures}
            config={terraDrawMapConfig}
            minZoom={8}
            FiltersValue={FiltersValue}
            activityFilters={activityFilters}
            maxZoom={21}
            zoom={13}
            center={[2.62322, 48.40813]}
            maxBounds={[[2.2917527636, 48.1867854393], [3.1004132613, 48.6260818006]]}
            ref={el => {
              this.mapContainer = el;
            }}
            onUpdateDataDraw={this.handleUpdateDataDraw}
            onDeleteDataDraw={this.handleDeleteDataDraw}
            onSelectionChange={this.onSelectionChange}
            osmSource="https://{a-c}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
            editable={editable}
            mapDrawerProps={{
              expandOnInit: editable,
            }}
          />
        </Col>
        <Col span={24} lg={24}>
          <Card title={mapTitleLegend.title}>
            <FeaturesList
              filters={activityFilters}
              features={featureList}
              selectedFeaturesId={this.state.selectedFeaturesId}
              deleteFeatureById={this.deleteDrawData}
              editable={editable}
              withIncidence={withIncidence}
              activityDates={this.props.activityDates}
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
  bindActionCreators({
    updateConfigValue,
  }, dispatch);

FormMap.propTypes = {
  updateFeatures: PropTypes.func,
  deleteFeaturesById: PropTypes.func,
  withIncidence: PropTypes.bool,
  editable: PropTypes.bool,
  activity: PropTypes.shape({
    type: PropTypes.string,
    eventDates: PropTypes.array,
    uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    participantCount: PropTypes.string,
    publicCount: PropTypes.string,
  }),
  features: PropTypes.arrayOf(PropTypes.shape({
    properties: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    geometry: PropTypes.object,
  })),
};

FormMap.defaultProps = {
  updateFeatures: () => {},
  deleteFeaturesById: () => {},
  features: [],
  activity: {
    uid: 0,
  },
  withIncidence: false,
  editable: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormMap);
