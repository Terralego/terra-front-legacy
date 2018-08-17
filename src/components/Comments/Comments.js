import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form as ReduxForm } from 'react-redux-form';
import { Button } from 'antd';

import withAuthentication from 'hoc/authentication';
import { canCommentInternal } from 'helpers/permissionsHelpers';

import { submitComment } from 'modules/userrequestComment';

import CommentRecipients from 'components/Comments/CommentRecipients';
import CommentList from 'components/Comments/CommentList';
import TextArea from 'components/Fields/TextArea';
import UploadAttachment from 'components/UploadAttachment/UploadAttachment';
import styles from 'components/Comments/Comments.module.scss';

class Comments extends React.Component {
  handleSubmit = () => {
    const { userrequestId, newComment, user } = this.props;
    const internal = canCommentInternal(user.permissions, newComment.is_internal);
    this.props.submitComment(userrequestId, newComment, internal);
  }

  isEnabled = () => {
    const { newComment, form, user } = this.props;
    // The comment contain :
    const hasComment = newComment.properties.comment !== ''; // a message
    const hasAttachment = newComment.attachment !== null; // an attachment
    const hasGeojson = newComment.geojson.features.length; // a geojson
    const hasAtLeastOneContent = hasComment || hasAttachment || hasGeojson;
    // If user should choose recipient, a recipient is defined
    const hasRecipient = canCommentInternal(user.permissions, newComment.is_internal) !== null;

    if (form.valid && hasAtLeastOneContent && hasRecipient) {
      return true;
    }

    return false;
  }

  render () {
    const { form, userrequestId } = this.props;
    return (
      <ReduxForm model="userrequestComment">
        <div className={styles.commentForm}>
          <CommentRecipients />
          <TextArea
            style={{ marginBottom: -12 }}
            model=".properties.comment"
            placeholder="Entrez votre message..."
          />
          <UploadAttachment />
          <div className={styles.commentForm_submit}>
            <Button
              type="primary"
              htmlType="submit"
              icon="arrow-right"
              loading={form.pending}
              disabled={!this.isEnabled()}
              onClick={this.handleSubmit}
            >
              Envoyer
            </Button>
          </div>
        </div>
        <CommentList userrequestId={userrequestId} />
      </ReduxForm>
    );
  }
}

Comments.propTypes = {
  userrequestId: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  form: state.forms.userrequestComment.$form,
  newComment: state.userrequestComment,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    submitComment,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withAuthentication(Comments));
