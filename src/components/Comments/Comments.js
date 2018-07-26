import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form as ReduxForm } from 'react-redux-form';
import { Button } from 'antd';

import { submitComment } from 'modules/userrequestComment';

import CommentList from 'components/Comments/CommentList';
import TextArea from 'components/Fields/TextArea';
import UploadAttachment from 'components/UploadAttachment/UploadAttachment';

import styles from './Comments.module.scss';

class Comments extends React.Component {
  handleSubmit = () => {
    const { userrequestId, newComment } = this.props;
    this.props.submitComment(userrequestId, newComment, false);
  }

  render () {
    const { form, userrequestId } = this.props;
    return (
      <ReduxForm model="userrequestComment">
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

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
