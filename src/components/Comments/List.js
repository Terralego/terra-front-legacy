import React from 'react';
import { List } from 'antd';

import CommentListItem from 'components/Comments/CommentListItem';
import styles from './List.module.scss';

const ListWrapper = ({ comments }) => (
  comments.length ?
    <List
      className={styles.listShowList}
      dataSource={comments}
      renderItem={comment => <CommentListItem comment={comment} />}
    />
    :
    <p className={styles.pShowList}>
      Aucun échange sur cette demande pour l'instant
    </p>
);

export default ListWrapper;
