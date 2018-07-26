import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Button, Icon } from 'antd';
import FormMap from 'components/FormMap/FormMap';

import {
  addRequestCommentFeature,
  removeRequestCommentFeature,
  removeRequestCommentNewFeature,
} from 'modules/userrequestComments';


class ModalComment extends React.Component {
  state = {
    showDrawMap: false,
    tempFeatures: [],
  };

  addLocalRequest = feature => {
    this.setState({ tempFeatures: [...this.state.tempFeatures, feature] });
  }

  handleMapCancel = () => {
    this.setState({
      showDrawMap: !this.state.showDrawMap,
      tempFeatures: [...this.props.comment.geojson.tempFeatures],
    });
  }

  handleMapRemove = id => {
    this.props.removeRequestCommentFeature(id);
  }

  handleMapSubmit = () => {
    this.setState({ showDrawMap: !this.state.showDrawMap });
    this.props.addRequestCommentFeature(this.state.tempFeatures);
  }

  removeRequestCommentFeature = id => {
    this.setState({
      tempFeatures: this.state.tempFeatures.filter(feature => feature.properties.id !== id),
    });
    this.props.removeRequestCommentFeature();
  }

  render () {
    const { tempFeatures, showDrawMap } = this.state;
    const { features } = this.props.comment.geojson;
    return (
      <div>
        {showDrawMap &&
          <Modal
            title="Editer un tracé"
            visible={showDrawMap}
            onOk={this.handleMapSubmit}
            onCancel={this.handleMapCancel}
            width="800px"
          >
            <FormMap
              features={tempFeatures}
              drawMode="pointer"
              activity={{
                type: '',
                eventDates: Array(1),
                uid: 0,
                participantCount: '1',
                publicCount: '0',
              }}
              editable
              onAddFeature={this.addLocalRequest}
              onRemoveFeature={this.removeRequestCommentFeature}
            />
          </Modal>
        }
        <Button
          type="default"
          icon="edit"
          onClick={() => this.setState({ showDrawMap: !showDrawMap })}
        >
          {features.length !== 0 ? 'Modifier des tracés' : 'Rééditer un tracé'}
        </Button>
        {features.length !== 0 &&
        <p>
          <strong style={{ fontSize: '0.9em' }}><Icon type="paper-clip" /> Tracé(s) en attente d'envoi</strong>
          <Button
            type="danger"
            icon="edit"
            size="small"
            onClick={() =>
              this.props.removeRequestCommentNewFeature() &&
              this.setState({ tempFeatures: [] })}
          >
            Supprimer tous les tracés
          </Button>
        </p>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  comment: state.userrequestComments,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    addRequestCommentFeature,
    removeRequestCommentFeature,
    removeRequestCommentNewFeature,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ModalComment);
