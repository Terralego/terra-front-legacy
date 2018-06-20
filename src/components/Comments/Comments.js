import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-redux-form';
import { Spin, List, Button } from 'antd';
import moment from 'moment';

import {
  fetchUserrequestComments,
  getCommentsByUserrequest,
  submitComment,
} from 'modules/userrequestComments';
import TextArea from 'components/Fields/TextArea';

class Comments extends React.Component {
  componentDidMount () {
    if (!this.props.loading && !this.props.fetched) {
      this.props.fetchUserrequestComments(this.props.userrequestId);
    }
  }

  handleSubmit = () => {
    this.props.submitComment(this.props.userrequestId, this.props.comment);
  }

  render () {
    const { comments, loading, form } = this.props;

    return (
      <Form model="userrequestComments">
        <TextArea
          style={{ marginBottom: 12 }}
          model=".text"
          placeholder="Entrez votre message..."
          errorMessages={{ required: 'Veuillez écrire un message' }}
          required
        />
        <div style={{ textAlign: 'right' }}>
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
            <List.Item key={`comment_${comment.content}`}>
              <List.Item.Meta
                title="Administrateur"
                description={comment.content}
                style={{ marginBottom: 16 }}
              />
              <div style={{ textAlign: 'right' }}>
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
      </Form>
    );
  }
}

Comments.propTypes = {
  userrequestId: PropTypes.string.isRequired,
};

const StateToProps = (state, props) => ({
  comments: getCommentsByUserrequest(state, props.userrequestId),
  loading: state.userrequestComments.loading,
  form: state.forms.userrequestComments.$form,
  comment: state.userrequestComments.text,
});

const DispatchToProps = dispatch =>
  bindActionCreators({ fetchUserrequestComments, submitComment }, dispatch);

export default connect(StateToProps, DispatchToProps)(Comments);
