import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import moment from 'moment';

import List from 'components/Comments/List';
import { submitComment } from 'modules/userrequestComment';
import {
  fetchUserrequestComments,
  getCommentsByUserrequest,
} from 'modules/userrequestCommentList';
import styles from './CommentList.module.scss';

class CommentList extends React.Component {
  componentDidMount () {
    if (!this.props.comments.length && !this.props.loading && !this.props.fetched) {
      this.props.fetchUserrequestComments(this.props.userrequestId);
    }
  }

  render () {
    const { comments, loading } = this.props;
    // Sort comments by antechronological order
    comments.sort((a, b) => (moment(b.date).isBefore(a.date) ? -1 : 1));
    return loading
      ? <Spin className={styles.loadingSpin} />
      : <List comments={this.props.comments} />;
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
