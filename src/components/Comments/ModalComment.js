import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Button, Icon } from 'antd';
import FormMap from 'components/FormMap/FormMap';

import {
  addRequestCommentFeature,
  removeRequestCommentFeature,
  removeRequestCommentNewFeature,
  geojsonSendingFeatures,
} from 'modules/userrequestComments';


class ModalComment extends React.Component {
  state = {
    showDrawMap: false,
    features: [],
    func: features => {
      this.setState({ features: [...this.state.features, { ...features }] });
    },
  };

  handleMapCancel = () => {
    this.setState({ features: [], showDrawMap: !this.state.showDrawMap });
  }

  handleMapRemove = id => {
    this.props.removeRequestCommentFeature(id);
    this.props.geojsonSendingFeatures();
  }

  handleMapSubmit = () => {
    this.setState({ showDrawMap: !this.state.showDrawMap });
    this.props.addRequestCommentFeature(this.state.features);
    this.props.geojsonSendingFeatures();
  }

  render () {
    console.log(this.state);
    const { features, func, showDrawMap } = this.state;
    const { features: reduxFeatures } = this.props.comment.geojson;
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
              onAddFeature={[func]}
              onRemoveFeature={this.props.removeRequestCommentFeature}
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
    geojsonSendingFeatures,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ModalComment);
