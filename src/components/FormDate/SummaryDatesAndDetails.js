import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'antd';
import DateRender from 'components/FormDate/DateRender';
import SummaryDates from 'components/FormDate/SummaryDates';
import styles from './SummaryDatesAndDetails.module.scss';

class SummaryDatesAndDetails extends React.Component {
  /**
   * Delete a group of dates
   * @param {number} uid of the group of dates
   */
  onRemove = () => {
    const { onRemove, dates: { uid } } = this.props;
    return onRemove(uid);
  }

  render () {
    const { dates, onRemove } = this.props;

    return (
      <Collapse className={styles.summaryDatesAndDetails}>
        <Collapse.Panel
          header={
            <SummaryDates
              dates={dates}
              onRemove={onRemove && this.onRemove}
            />
          }
        >
          {dates.dates.map(date => (
            <DateRender
              key={date.startDate + date.endDate}
              className={styles.summaryDatesAndDetails__item}
              from={date.startDate}
              to={date.endDate}
              withTime
            />
          ))}
        </Collapse.Panel>
      </Collapse>
    );
  }
}

SummaryDatesAndDetails.propTypes = {
  dates: PropTypes.object.isRequired,
  onRemove: PropTypes.func,
};

export default SummaryDatesAndDetails;
