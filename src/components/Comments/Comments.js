import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form as ReduxForm } from 'react-redux-form';
import { Spin, List, Button } from 'antd';
import moment from 'moment';

import { getUserGroup } from 'modules/authentication';
import {
  fetchUserrequestComments,
  getCommentsByUserrequest,
  submitComment,
  removeRequestCommentNewFeature,
} from 'modules/userrequestComments';
import ModalComment from 'components/Comments/ModalComment';
import TextArea from 'components/Fields/TextArea';
import Select from 'components/Fields/Select';
import FormMap from 'components/FormMap/FormMap';


import config from 'components/Comments/Comments.config';

import styles from './Comments.module.scss';

class Comments extends React.Component {
  componentDidMount () {
    if (!this.props.comments.length && !this.props.loading && !this.props.fetched) {
      this.props.fetchUserrequestComments(this.props.userrequestId);
    }
  }

  handleSubmit = () => {
    const { userrequestId, comment, userGroup } = this.props;
    // Only N2 can choose if message is private or not
    // If N1, always set internal to true
    const internal = userGroup === 'N2' ? comment.is_internal : true;
    this.props.submitComment(userrequestId, comment, internal);
    // On arrête d'afficher la note de prêt à l'envoi du geojson.
    this.props.removeRequestCommentNewFeature();
  }

  render () {
    const { comments, loading, form, userGroup } = this.props;
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
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <ModalComment />
          <Button
            style={{ marginLeft: 10 }}
            type="primary"
            htmlType="submit"
            icon="arrow-right"
            loading={form.pending}
            disabled={!form.valid}
            onClick={this.handleSubmit}
          >
            Envoyer
          </Button>
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
              {/* {<FormMap
                features={[
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                    },
                    coordinates: [{ 0: { 0: 2.619763893084242 }, 1: { 1: 48.427269827425164 } }],
                    properties: {
                      id: '38599e32-7a3a-780e-08fd-b3c62774b8a0',
                      name: 'LineString',
                    },
                  },
                ]}
              />} */}
              {/* {comment.geojson && <FormMap features={comment.geojson.features} />} */}
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
    removeRequestCommentNewFeature,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
