import React from 'react';
import { Alert } from 'antd';

import styles from 'components/Form/SubmitFailed/styles.module.scss';
import ErrorItem from './ErrorItem';

export const SubmitFailed = ({ errors }) => (
  <Alert
    type="error"
    className={styles.submitFailed}
    message={
      <React.Fragment>
        <p>
          Veuillez compléter tous les champs obligatoires suivants :
        </p>
        <ul>
          {errors.map(error => (
            <ErrorItem
              key={error}
              error={error}
            />
          ))}
        </ul>
      </React.Fragment>
    }
  />
);

export default SubmitFailed;
