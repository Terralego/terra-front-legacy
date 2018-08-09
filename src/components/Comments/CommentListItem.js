import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { List } from 'antd';
import moment from 'moment';

import CommentItemAttachments from 'components/Comments/CommentItemAttachments';

import styles from './Comments.module.scss';

const CommentListItem = ({ comment }) => (
  <List.Item
    key={comment.content}
    className={classnames({
      [styles.internalItem]: comment.is_internal,
      [styles.listItem]: true,
    })}
  >
    <div className={styles.commentItem}>
      <div className={styles.commentContent}>
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
      </div>

      <CommentItemAttachments {...comment} />
    </div>
  </List.Item>
);

CommentListItem.propTypes = {
  comment: PropTypes.shape({
    author: PropTypes.string,
    content: PropTypes.string,
    date: PropTypes.string,
    is_internal: PropTypes.bool,
  }).isRequired,
};

export default CommentListItem;
