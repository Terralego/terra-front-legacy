import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Spin, List } from 'antd';
import moment from 'moment';

import { submitComment } from 'modules/userrequestComment';
import {
  fetchUserrequestComments,
  getCommentsByUserrequest,
} from 'modules/userrequestCommentList';
import CommentListItem from 'components/Comments/CommentListItem';

class CommentList extends React.Component {
  componentDidMount () {
    if (!this.props.comments.length && !this.props.loading && !this.props.fetched) {
      this.props.fetchUserrequestComments(this.props.userrequestId);
    }
  }

  render () {
    const { comments, loading } = this.props;
    // Sort comments by antechronological order
    comments.sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf());
    return loading
      ? <Spin style={{ margin: '24px auto', width: '100%' }} />
      : <List
        style={{ marginTop: 24 }}
        dataSource={comments}
        renderItem={comment => <CommentListItem comment={comment} />}
      />;
  }
}

CommentList.propTypes = {
  userrequestId: PropTypes.string.isRequired,
};

const mapStateToProps = (state, props) => ({
  comments: getCommentsByUserrequest(state, props.userrequestId),
  loading: state.userrequestCommentList.loading,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    fetchUserrequestComments,
    submitComment,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);
