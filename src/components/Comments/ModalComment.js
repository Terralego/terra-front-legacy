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
    features: [],
  };

  addLocalRequest = feature => {
    this.setState({ features: [...this.state.features, feature] });
  }

  handleMapCancel = () => {
    this.setState({
      showDrawMap: !this.state.showDrawMap,
      features: [...this.props.comment.geojson.features],
    });
  }

  handleMapRemove = id => {
    this.props.removeRequestCommentFeature(id);
  }

  handleMapSubmit = () => {
    this.setState({ showDrawMap: !this.state.showDrawMap });
    this.props.addRequestCommentFeature(this.state.features);
  }

  removeRequestCommentFeature = id => {
    this.setState({
      features: this.state.features.filter(feature => feature.properties.id !== id),
    });
    this.props.removeRequestCommentFeature();
  }

  render () {
    const { features, showDrawMap } = this.state;
    const reduxFeatures = this.props.comment.geojson.features;
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
              features={features}
              drawMode="pointer"
              activity={{
                type: '',
                eventDates: Array(1),
                uid: 0,
                participantCount: '1',
                publicCount: '0',
              }}
              editable
              onAddFeature={[this.addLocalRequest]}
              onRemoveFeature={this.removeRequestCommentFeature}
            />
          </Modal>
        }
        {reduxFeatures.length !== 0 &&
        <p>
          <strong style={{ fontSize: '0.9em' }}><Icon type="paper-clip" /> Pièce jointe en attente d'envoi</strong>
          <Button
            type="danger"
            icon="edit"
            size="small"
            onClick={() =>
              this.props.removeRequestCommentNewFeature() &&
              this.setState({ features: [] })}
          >
            Supprimer tous les tracés
          </Button>
        </p>}
        <Button
          type="default"
          icon="edit"
          onClick={() => this.setState({ showDrawMap: !showDrawMap })}
        >
          {reduxFeatures.length !== 0 ? 'Modifier des tracés' : 'Rééditer un tracé'}
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
    addRequestCommentFeature,
    removeRequestCommentFeature,
    removeRequestCommentNewFeature,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ModalComment);
