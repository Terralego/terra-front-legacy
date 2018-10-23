import React from 'react';
import { Alert } from 'antd';

import ErrorMessages from 'components/Form/SubmitFailed/ErrorMessages';
import styles from 'components/Form/SubmitFailed/styles.module.scss';

export const SubmitFailed = ({ errors = [] }) => (
  <Alert
    type="error"
    className={styles.submitFailed}
    message={
      <React.Fragment>
        <p>Les éléments suivants sont obligatoires :</p>
        <ErrorMessages errors={errors} />
      </React.Fragment>
    }
  />
);

export default SubmitFailed;
