import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

/**
 * DateRender
 * Give dates of start and end and it will returns a sentence
 *
 * @param {(string|Object)} from - date of start
 * @param {(string|Object)} to - date of end
 * @param {boolean} [withTime=false] - add time (hours + minute)
 * @returns {ReactElement} sentence
 */
const DateRender = ({ from, to, withTime, className }) => {
  const momentFrom = moment(from);
  const momentTo = moment(to);

  if (!momentFrom.isValid() || !momentTo.isValid()) {
    return null;
  }
  const start = momentFrom.format('DD/MM/YYYY');
  const end = momentTo.format('DD/MM/YYYY');
  const time = withTime
    ? <span> de {momentFrom.format('HH:mm')} à {momentTo.format('HH:mm')}</span>
    : null;

  return start === end
    ? <span className={className}>Le {start}{time}.</span>
    : <span className={className}>Du {start} au {end}{time}.</span>;
};

DateRender.propTypes = {
  from: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  to: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  withTime: PropTypes.bool,
  className: PropTypes.string,
};

DateRender.defaultProps = {
  withTime: false,
  className: '',
};

export default DateRender;
