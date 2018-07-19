import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Button, Icon } from 'antd';
import FormMap from 'components/FormMap/FormMap';

import {
  fetchUserrequestComments,
  submitComment,
  addRequestCommentFeature,
  removeRequestCommentFeature,
  removeRequestCommentNewFeature,
  geojsonSendingFeatures,
  removeDefaultFeatures,
} from 'modules/userrequestComments';


class ModalComment extends React.Component {
  state = {
    showDrawMap: false,
  };

  handleMapCancel = () => {
    this.props.removeDefaultFeatures();
    this.setState({ showDrawMap: !this.state.showDrawMap });
  }

  handleMapRemove = id => {
    this.props.removeRequestCommentFeature(id);
    this.props.geojsonSendingFeatures();
  }

  handleMapSubmit = () => {
    this.setState({ showDrawMap: !this.state.showDrawMap });
    this.props.geojsonSendingFeatures();
  }

  render () {
    const { showDrawMap } = this.state;
    const { features } = this.props.comment.geojson;
    const { features: featureSending } = this.props.comment.sendingFeatures.geojson;

    return (
      <div>
        {showDrawMap &&
          <Modal
            title="Basic Modal"
            visible={showDrawMap}
            onOk={this.handleMapSubmit}
            onCancel={this.handleMapCancel}
          >
            <FormMap
              features={[]}
              drawMode="pointer"
              activity={{
                type: '',
                eventDates: Array(1),
                uid: 0,
                participantCount: '1',
                publicCount: '0',
              }}
              editable
              onAddFeature={[this.props.addRequestCommentFeature]}
              onRemoveFeature={this.props.removeRequestCommentFeature}
            />
            <div style={{ fontSize: '0.9em' }}>
              {features.map(feature => (
                <p style={{ marginTop: 7 }}>
                  <strong><Icon type="paper-clip" /> Tracé numéro {feature.properties.id} prêt à l'envoi</strong>
                  <Button
                    style={{ marginLeft: 10 }}
                    type="danger"
                    icon="cross"
                    size="small"
                    onClick={() => this.handleMapRemove(feature.properties.id)}
                  >
                    Supprimer le tracé
                  </Button>
                </p>))}
            </div>
          </Modal>
        }
        {featureSending.length !== 0 &&
        <p>
          <strong style={{ fontSize: '0.9em' }}><Icon type="paper-clip" /> Pièce jointe en attente d'envoi</strong>
          <Button
            type="danger"
            icon="edit"
            size="small"
            onClick={() => this.props.removeRequestCommentNewFeature()}
          >
            Supprimer tous les tracés
          </Button>
        </p>}
        <Button
          type="default"
          icon="edit"
          onClick={() => this.setState({ showDrawMap: !showDrawMap })}
        >
          {featureSending.length !== 0 ? 'Modifier des tracés' : 'Rééditer un tracé'}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  comment: state.userrequestComments,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    fetchUserrequestComments,
    submitComment,
    addRequestCommentFeature,
    removeRequestCommentFeature,
    removeRequestCommentNewFeature,
    geojsonSendingFeatures,
    removeDefaultFeatures,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ModalComment);
