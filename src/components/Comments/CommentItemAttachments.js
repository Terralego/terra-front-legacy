import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import styles from 'components/Comments/CommentItemAttachments.module.scss';

const CommentItemAttachments = ({ attachment }) => (
  attachment ?
    <ul className={styles.attachmentList}>
      {attachment &&
      <li className={styles.attachmentListItem}>
        <a href={attachment.url} className={styles.attachmentLink}>
          <Icon type="paper-clip" /> {attachment.name}
        </a>
      </li>
    }
    </ul>
    : null
);

CommentItemAttachments.propTypes = {
  attachment: PropTypes.shape({
    url: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default CommentItemAttachments;
