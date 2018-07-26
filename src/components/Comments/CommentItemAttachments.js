import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'antd';

import FormMap from 'components/FormMap/FormMap';

import styles from 'components/Comments/CommentItemAttachments.module.scss';

class CommentItemAttachments extends React.Component {
  state = {
    showDrawMap: false,
  }

  render () {
    const { attachment, geojson } = this.props;
    const { showDrawMap } = this.state;

    if (!attachment && !geojson) {
      return null;
    }

    return (
      <ul className={styles.attachmentList}>
        {attachment &&
          <li className={styles.attachmentListItem}>
            <a href={attachment.url}>
              <Icon type="paper-clip" /> {attachment.name}
            </a>
          </li>
        }

        {geojson &&
          <li>
            <button onClick={() => this.setState({ showDrawMap: !showDrawMap })}>
              <Icon type="paper-clip" /> Parcours proposé
            </button>

            <Modal
              title="Tracé"
              visible={showDrawMap}
              onOk={() => this.setState({ showDrawMap: !showDrawMap })}
              onCancel={() => this.setState({ showDrawMap: !showDrawMap })}
              width="800px"
            >
              <FormMap feature={geojson.features} activity={this.state.activity} />
            </Modal>
          </li>
        }
      </ul>
    );
  }
}

CommentItemAttachments.propTypes = {
  attachment: PropTypes.shape({
    url: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  geojson: PropTypes.object.isRequired,
};

export default CommentItemAttachments;
