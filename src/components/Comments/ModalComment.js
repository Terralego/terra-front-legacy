import React from 'react';
import PropTypes from 'prop-types';
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
  removeRequestCommentByCancel,
} from 'modules/userrequestComments';


class ModalComment extends React.Component {
  state = {
    showDrawMap: false,
  };

  handleMapCancel = () => {
    this.setState({ showDrawMap: !this.state.showDrawMap });
    this.props.removeRequestCommentByCancel();
  }

  handleMapRemove = () => {
    this.props.removeRequestCommentNewFeature();
  }

  handleMapSubmit = () => {
    this.setState({ showDrawMap: !this.state.showDrawMap });
    this.props.geojsonSendingFeatures();
  }

  render () {
    const { showDrawMap } = this.state;
    const { features } = this.props.comment.sendingFeatures.geojson;

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
          </Modal>
        }
        {features.length !== 0 &&
          <div style={{ fontSize: '0.9em' }}>
            <p style={{ marginTop: 7 }}>
              <strong><Icon type="paper-clip" /> Tracé prêt à l'envoi</strong>
              <Button
                style={{ marginLeft: 10 }}
                type="danger"
                icon="cross"
                size="small"
                onClick={this.handleMapRemove}
              >
                Supprimer le tracé
              </Button>
            </p>
          </div>
        }
        <Button
          type="default"
          icon="edit"
          onClick={() => this.setState({ showDrawMap: !showDrawMap })}
        >
          {features.length !== 0 ? 'Modifier le tracé' : 'Rééditer un tracé'}
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
    removeRequestCommentByCancel,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ModalComment);
