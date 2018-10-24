import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, Button } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import settings from 'front-settings';

import { updateConfigValue } from 'modules/appConfig';
import { getFeatureWithProperties, getActivityFeatures } from 'helpers/mapHelpers';
import { getFeatureById } from 'helpers/userrequestHelpers';
import FeaturesList from 'components/FormMap/FeatureList';
import TerraDrawMap from 'components/TerraDrawMap/TerraDrawMap';
import { terraDrawMapConfig, terraDrawMapProps, mapTitleLegend } from 'components/FormMap/FormMap.config';

class FormMap extends Component {
  state = {
    selectedFeaturesId: [],
    showGeojsonConflicts: false,
  };

  onSelectionChange = e => {
    this.setState({ selectedFeaturesId: e.features.map(feature => feature.id) });
  }

  onConflictsChange = () => {
    this.setState({ showGeojsonConflicts: !this.state.showGeojsonConflicts });
  }

  setRef = el => {
    this.mapContainer = el;
    return this;
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
      editable,
      activity,
      withIncidence,
      activityFilters,
      geojsonConflicts,
      activityDates,
      onlyMap,
      mapProps,
      deleteFeaturesById,
    } = this.props;

    const activityFeatures = getActivityFeatures(features, activity.uid);
    const featureList = activityFeatures.filter(feature => !feature.properties.routeInProgress);

    const mapDrawerProps = { expandOnInit: editable };
    return (
      <Row gutter={24} style={{ paddingBottom: 24 }}>
        <Col span={24} lg={24} style={{ height: 450, overflow: 'hidden', position: 'relative' }}>
          <TerraDrawMap
            geojsonConflicts={geojsonConflicts}
            showGeojsonConflicts={this.state.showGeojsonConflicts}
            mapboxAccessToken={settings.MAPBOX_ACCESS_TOKEN}
            features={activityFeatures}
            config={terraDrawMapConfig}
            deleteFeaturesById={deleteFeaturesById}
            activityFilters={activityFilters}
            activityDates={activityDates}
            onUpdateDataDraw={this.handleUpdateDataDraw}
            onDeleteDataDraw={this.handleDeleteDataDraw}
            onSelectionChange={this.onSelectionChange}
            editable={editable}
            mapDrawerProps={mapDrawerProps}
            mapProps={mapProps}
            ref={this.setRef}
            {...terraDrawMapProps}
            onlyMap={onlyMap}
          />
        </Col>
        {!onlyMap &&
          <Col span={24} lg={24}>
            <Card
              title={
                <React.Fragment>
                  <p>{mapTitleLegend.title}</p>
                  {geojsonConflicts.features.length > 0 &&
                    <Button
                      onClick={this.onConflictsChange}
                    >
                      Afficher les conflits avec d'autres activités
                    </Button>
                  }
                </React.Fragment>
              }
            >
              <FeaturesList
                activityDates={activityDates}
                filters={activityFilters}
                activity={activity}
                features={featureList}
                selectedFeaturesId={this.state.selectedFeaturesId}
                deleteFeatureById={this.deleteDrawData}
                editable={editable}
                withIncidence={withIncidence}
              />
            </Card>
          </Col>
        }
      </Row>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
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
  geojsonConflicts: PropTypes.object,
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
  mapProps: PropTypes.object,
  onlyMap: PropTypes.bool,
};

FormMap.defaultProps = {
  geojsonConflicts: {
    features: [],
  },
  updateFeatures: () => {},
  deleteFeaturesById: () => {},
  features: [],
  activity: {
    uid: 0,
  },
  withIncidence: false,
  editable: false,
  mapProps: {},
  onlyMap: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormMap);
