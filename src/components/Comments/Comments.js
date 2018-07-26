import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form as ReduxForm } from 'react-redux-form';
import { Spin, List, Button, Modal } from 'antd';
import moment from 'moment';

import { getUserGroup } from 'modules/authentication';
import { submitComment } from 'modules/userrequestComment';
import {
  fetchUserrequestComments,
  getCommentsByUserrequest,
} from 'modules/userrequestCommentList';
import TextArea from 'components/Fields/TextArea';
import Select from 'components/Fields/Select';
import FormMap from 'components/FormMap/FormMap';
import UploadAttachment from 'components/UploadAttachment/UploadAttachment';

import config from 'components/Comments/Comments.config';

import styles from './Comments.module.scss';

class Comments extends React.Component {
  state = {
    showDrawMap: false,
  }

  componentDidMount () {
    if (!this.props.comments.length && !this.props.loading && !this.props.fetched) {
      this.props.fetchUserrequestComments(this.props.userrequestId);
    }
  }

  handleSubmit = () => {
    const { userrequestId, newComment, userGroup } = this.props;
    // Only N2 can choose if message is private or not
    // If N1, always set internal to true
    const internal = userGroup === 'N2' ? newComment.is_internal : true;
    this.props.submitComment(userrequestId, newComment, internal);
  }

  render () {
    const { comments, loading, form, userGroup } = this.props;
    return (
      <ReduxForm model="userrequestComment">
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
          style={{ marginBottom: -12 }}
          model=".properties.comment"
          placeholder="Entrez votre message..."
        />
        <UploadAttachment />
        <div className={styles.submitButton}>
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
        </div>

        {loading
        ? <Spin style={{ margin: '24px auto', width: '100%' }} />
        : <List
          style={{ marginTop: 24 }}
          dataSource={comments}
          renderItem={comment => (
            <div>
              <List.Item
                key={comment.content}
                className={classnames({
                  [styles.internalItem]: comment.is_internal,
                  [styles.listItem]: true,
                })}
                style={{ marginBottom: -35, paddingBottom: 60 }}
              >
                <List.Item.Meta
                  title={comment.author}
                  description={comment.content}
                  style={{ marginTop: 10 }}
                />
                <div style={{ textAlign: 'right', marginTop: 10 }}>
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
              {comment.features &&
                <Button
                  type="default"
                  icon="edit"
                  size="small"
                  onClick={() => this.setState({
                      features: comment.features || [],
                      activity: comment.activity || [],
                      showDrawMap: !this.state.showDrawMap,
                    })}
                >
                  Voir le tracé en pièce jointe
                </Button>
              }
            </div>
          )}
        />}
        <Modal
          title="Tracé"
          visible={this.state.showDrawMap}
          onOk={() => this.setState({ showDrawMap: !this.state.showDrawMap })}
          onCancel={() => this.setState({ showDrawMap: !this.state.showDrawMap })}
          width="800px"
        >
          <FormMap feature={this.state.features} activity={this.state.activity} />
        </Modal>
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
  loading: state.userrequestCommentList.loading,
  form: state.forms.userrequestComment.$form,
  newComment: state.userrequestComment,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    fetchUserrequestComments,
    submitComment,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
