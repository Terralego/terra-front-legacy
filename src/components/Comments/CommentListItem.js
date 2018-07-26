import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { List, Button, Modal } from 'antd';
import moment from 'moment';

import FormMap from 'components/FormMap/FormMap';

import styles from './Comments.module.scss';

class CommentListItem extends React.Component {
  state = {
    showDrawMap: false,
  }

  render () {
    const { comment } = this.props;
    return (
      <React.Fragment>
        <List.Item
          key={comment.content}
          className={classnames({
            [styles.internalItem]: comment.is_internal,
            [styles.listItem]: true,
          })}
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
        {comment.geojson &&
          <React.Fragment>
            <Button
              type="default"
              icon="edit"
              size="small"
              onClick={() => this.setState({
                showDrawMap: !this.state.showDrawMap,
              })}
            >
              Voir le tracé en pièce jointe
            </Button>
            <Modal
              title="Tracé"
              visible={this.state.showDrawMap}
              onOk={() => this.setState({ showDrawMap: !this.state.showDrawMap })}
              onCancel={() => this.setState({ showDrawMap: !this.state.showDrawMap })}
              width="800px"
            >
              <FormMap feature={comment.geojson.features} activity={this.state.activity} />
            </Modal>
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

CommentListItem.propTypes = {
  comment: PropTypes.shape({
    author: PropTypes.string,
    content: PropTypes.string,
    date: PropTypes.string,
    is_internal: PropTypes.bool,
  }).isRequired,
};

export default CommentListItem;
