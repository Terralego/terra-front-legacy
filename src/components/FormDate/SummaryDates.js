import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Icon } from 'antd';
import DateRender from 'components/FormDate/DateRender';
import { RECURRENCE_NONE, optionsRecurrence } from 'helpers/dateHelpers';
import styles from './SummaryDates.module.scss';

/**
 * Get the value of recurrence type
 * and search and return the matching label
 * @param {string} type - value `none`, `days`, `weeks`, or `months` expected
 * @returns {string} formated wording
*/
function getType (type) {
  return optionsRecurrence
    .find(option => option.value === type).label;
}

/**
 * SummaryDates
 * Display a summary of the selected dates
 *
 * @param {Object} dates
 * @param {Boolean} RemovesDates - display or not the action to delete dates
 * @returns {ReactElement} List of dates
 */
const SummaryDates = ({ dates, onRemove }) => {
  const {
    dates: summaryDates,
    recurrence: { type, frequency, limitDate },
  } = dates;
  const datesLength = summaryDates.length;

  return (
    <div className={styles.summaryDates}>
      <div className={styles.summaryDates__counter}>
        {datesLength} {datesLength > 1 ? 'dates' : 'date'}
      </div>
      <div>
        <DateRender
          from={summaryDates[0].startDate}
          to={summaryDates[0].endDate}
          withTime
        />
        {type !== RECURRENCE_NONE && (
          <div>
            Récurrence tou(te)s les {frequency > 1 && frequency} {getType(type)} jusqu'au {moment(limitDate).format('DD/MM/YYYY')}.
          </div>
        )}
      </div>
      {onRemove && (
        <div className={styles.summaryDates__button}>
          <Button
            type="danger"
            size="small"
            onClick={onRemove}
          >
            <Icon type="delete" />Supprimer
          </Button>
        </div>
      )}
    </div>
  );
};

SummaryDates.propTypes = {
  dates: PropTypes.object.isRequired,
  onRemove: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
};

SummaryDates.defaultProps = {
  onRemove: false,
};

export default SummaryDates;
