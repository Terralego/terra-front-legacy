import React from 'react';
import { Modal } from 'antd';

/**
 * Show informative modal
 * @param {string} title
 * @param {string} message
 * @param {history object} history
 * @param {string} redirection
 * @param {string} modalType -> can only be success, info, warning or error.
 */
const modalInfo = (title, message, history, redirection, modalType) =>
  Modal[modalType]({
    title,
    content: (
      <div>
        <p>{message}</p>
      </div>
    ),
    onOk () {
      history.push(redirection);
    },
  });

export default modalInfo;
