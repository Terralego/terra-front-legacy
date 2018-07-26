import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form as ReduxForm } from 'react-redux-form';
import { Button, Modal } from 'antd';

import { getUserGroup } from 'modules/authentication';
import { submitComment } from 'modules/userrequestComment';

import CommentList from 'components/Comments/CommentList';
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

  handleSubmit = () => {
    const { userrequestId, newComment, userGroup } = this.props;
    // Only N2 can choose if message is private or not
    // If N1, always set internal to true
    const internal = userGroup === 'N2' ? newComment.is_internal : true;
    this.props.submitComment(userrequestId, newComment, internal);
  }

  render () {
    const { form, userGroup, userrequestId } = this.props;
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
        <CommentList userrequestId={userrequestId} />
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

const mapStateToProps = state => ({
  userGroup: getUserGroup(state),
  form: state.forms.userrequestComment.$form,
  newComment: state.userrequestComment,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    submitComment,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
