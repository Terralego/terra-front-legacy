import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form as ReduxForm } from 'react-redux-form';
import { Spin, List, Button, Modal, Icon } from 'antd';
import moment from 'moment';
import FormMap from 'components/FormMap/FormMap';

import { getUserGroup } from 'modules/authentication';
import {
  fetchUserrequestComments,
  getCommentsByUserrequest,
  submitComment,
  addRequestCommentFeature,
  removeRequestCommentFeature,
} from 'modules/userrequestComments';
import TextArea from 'components/Fields/TextArea';
import Select from 'components/Fields/Select';

import config from 'components/Comments/Comments.config';

import styles from './Comments.module.scss';

class Comments extends React.Component {
  state = {
    showDrawMap: false,
    geojson: false,
    attachments: [],
  };

  componentDidMount () {
    if (!this.props.comments.length && !this.props.loading && !this.props.fetched) {
      this.props.fetchUserrequestComments(this.props.userrequestId);
    }
  }

  onOkHandle = () => {
    this.setState({ showDrawMap: !this.state.showDrawMap, geojson: true });
  }

  handleSubmit = () => {
    const { userrequestId, comment, userGroup } = this.props;
    // Only N2 can choose if message is private or not
    // If N1, always set internal to true
    const internal = userGroup === 'N2' ? comment.is_internal : true;
    this.props.submitComment(userrequestId, comment.text, internal);
  }

  render () {
    const { comments, loading, form, userGroup } = this.props;
    const { showDrawMap, geojson, attachments } = this.state;
    return (
      <ReduxForm model="userrequestComments">
        {userGroup === 'N2' && <Select
          placeholder="Choisir un destinataire"
          model=".is_internal"
          options={config.recipientsOptions}
          errorMessages={{ required: { message: 'Veuillez choisir un destinataire' } }}
        />}
        {userGroup === 'N1' &&
          <p>Votre message ne sera visible qu'en interne.</p>
        }
        <TextArea
          style={{ marginBottom: 12 }}
          model=".text"
          placeholder="Entrez votre message..."
          errorMessages={{ required: { message: 'Veuillez écrire un message' } }}
        />
        <div style={{ textAlign: 'right' }}>
          {showDrawMap &&
            <Modal
              title="Basic Modal"
              visible={showDrawMap}
              onOk={this.onOkHandle}
              onCancel={() => this.setState({ showDrawMap: !showDrawMap })}
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
                onAddFeature={this.props.addRequestCommentFeature}
                onRemoveFeature={this.props.removeRequestCommentFeature}
              />
            </Modal>
          }
          <Button
            style={{ marginRight: 10 }}
            type="default"
            icon="edit"
            onClick={() => this.setState({ showDrawMap: !showDrawMap })}
          >
            Rééditer un tracé
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon="arrow-right"
            loading={form.pending}
            disabled={!form.valid}
            onClick={this.handleSubmit}
          >
            Envoyer
          </Button>
          {geojson &&
            <p style={{ marginTop: 7, fontSize: '0.8em' }}>
              <strong><Icon type="paper-clip" /> Tracé prêt à l'envoi</strong>
            </p>
          }
          {attachments &&
            attachments.map(paper =>
              <p style={{ marginTop: 7, fontSize: '0.8em' }}><strong><Icon type="pushpin-o" /> {paper}</strong></p>)}
        </div>

        {loading
        ? <Spin style={{ margin: '24px auto', width: '100%' }} />
        : <List
          style={{ marginTop: 24 }}
          dataSource={comments}
          renderItem={comment => (
            <List.Item
              key={comment.content}
              className={classnames({
                [styles.internalItem]: comment.is_internal,
                [styles.listItem]: true,
              })}
            >
              <List.Item.Meta
                title={comment.author}
                description={comment.content}
              />
              <div style={{ textAlign: 'right' }}>
                {comment.is_internal &&
                  <span className={styles.internal}>Message interne</span>
                }
                <span style={{ display: 'block', color: 'rgba(0, 0, 0, 0.45)' }}>
                  {moment(comment.date).format('DD/MM/YY')}
                </span>
                <span style={{ display: 'block', color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}>
                  {moment(comment.date).format('HH[h]mm')}
                </span>
              </div>
            </List.Item>
          )}
        />}
      </ReduxForm>
    );
  }
}

Comments.propTypes = {
  userrequestId: PropTypes.string.isRequired,
};

const mapStateToProps = (state, props) => ({
  userGroup: getUserGroup(state),
  comments: getCommentsByUserrequest(state, props.userrequestId),
  loading: state.userrequestComments.loading,
  form: state.forms.userrequestComments.$form,
  comment: state.userrequestComments,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    fetchUserrequestComments,
    submitComment,
    addRequestCommentFeature, // Action Creator encore inutilisé
    removeRequestCommentFeature, // Action Creator encore inutilisé
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
