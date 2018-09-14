import React, { Component } from 'react';
import { Form, Row, Col, Button, Select, DatePicker, TimePicker, Input } from 'antd';
import moment from 'moment';

import { RECURRENCE_NONE, optionsRecurrence, isEndDateAfter, getDatesDuplicated } from 'helpers/dateHelpers';
import styles from './DatesListPicker.module.scss';

const FormItem = Form.Item;

class DatesListPicker extends Component {
  state = {
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    limitDate: '',
    recurrenceType: 'none',
    recurrenceFrequency: 1,
  };

  /**
   * Given a date,
   * replicate date values to time values
   * check if startDate is after endDate
   * if yes, put the startDate value to the endDate value
   * @param {date} date : moment object
   * @param {string} field : 'start' or 'end' value
   * @param {Number} uid : id of the date event
   */
  onDateChange (date, field = 'startDate') {
    if (!date) {
      return;
    }

    const { startDate, endDate, startTime, endTime } = this.state;
    const endDateIsAfter = isEndDateAfter(date, endDate);

    const getTime = pos => (
      (pos === 'start')
        ? {
          hour: moment(field === 'startTime' ? date : startTime).hour() || 9,
          minute: moment(field === 'startTime' ? date : startTime).minute() || 0,
          second: 0,
          milliseconds: 0,
        }
        : {
          hour: moment(field === 'endTime' ? date : endTime).hour() || 18,
          minute: moment(field === 'endTime' ? date : endTime).minute() || 0,
          second: 0,
          milliseconds: 0,
        }
    );

    const [newStart, newEnd] = field.startsWith('start')
      ? [
        moment(date || startDate).set(getTime('start')),
        moment((endDateIsAfter) ? endDate : date).set(getTime('end')),
      ]
      : [
        moment(startDate).set(getTime('start')),
        moment(date).set(getTime('end')),
      ];

    this.setState({
      startDate: newStart.toISOString(),
      startTime: newStart.toISOString(),
      endDate: newEnd.toISOString(),
      endTime: newEnd.toISOString(),
    });
  }

  /**
   * Given a string
   * @param {string} value of the selected item
   */
  onRecurrenceChange (value) {
    this.setState({
      recurrenceType: value,
    });
  }

  /**
   * Given a string
   * @param {string} value of the selected item
   */
  onLimitDateChange (value) {
    this.setState({
      limitDate: value,
    });
  }

  /**
   * Given a number
   * @param {number} value of the selected item
   */
  onRecurrenceFrequencyChange ({ target: { value: recurrenceFrequency } }) {
    this.setState({ recurrenceFrequency });
  }

  /**
   * Given a start date,
   * check if date is after day date
   * @param  {date} date : moment object
   * @returns boolean
   */
  disableStartDate = date => {
    if (!date) {
      return false;
    }
    // An activity can't start before 2 days
    const minDate = moment().add(1, 'd');
    return date.valueOf() < minDate.valueOf();
  }

  /**
   * Given an end date,
   * check if date is after selected start date
   * @param  {date} date : moment object
   * @returns boolean
   */
  disableEndDate = date => {
    const { startDate } = this.state;

    if (!date || !startDate) {
      return false;
    }
    const momentDate = moment(date);
    const momentStartDate = moment(startDate);
    // An activity can't last more than a year
    const momentLimitDate = moment(startDate).add(1, 'Y');
    return momentDate.valueOf() < momentStartDate.valueOf()
    || momentDate.valueOf() > momentLimitDate.valueOf();
  }

  /**
   * Confirm Date
   */
  confirmDate = () => {
    const { startDate, endDate, limitDate, recurrenceType, recurrenceFrequency } = this.state;
    this.setState({
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      limitDate: '',
      recurrenceType: RECURRENCE_NONE,
      recurrenceFrequency: 1,
    });
    this.props.onChange({
      ...getDatesDuplicated({
        startDate,
        endDate,
        limitDate,
        type: recurrenceType,
        frequency: recurrenceFrequency,
      }),
    });
  }

  render () {
    const { startDate, startTime, endDate, endTime, recurrenceType, limitDate } = this.state;

    const isStartDateValid = moment(startDate).isValid();

    return (
      <div className={styles.datesListPicker}>
        <Row gutter={24}>
          <Col span={24} md={12}>
            <Row>
              <Col span={24} sm={12}>
                <FormItem
                  label="Débute à partir du"
                  name="startDate"
                >
                  <DatePicker
                    placeholder="Saisissez une date"
                    format="DD/MM/YYYY"
                    disabledDate={this.disableStartDate}
                    onChange={value => this.onDateChange(value, 'startDate')}
                    allowClear={false}
                    initialValue={startDate}
                  />
                </FormItem>
              </Col>
              {isStartDateValid && (
                <Col span={24} sm={12}>
                  <FormItem
                    label="à"
                    name="startTime"
                  >
                    <TimePicker
                      format="kk:mm"
                      onChange={value => this.onDateChange(value, 'startTime')}
                      minuteStep={30}
                      value={moment(startTime)}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
          </Col>
          {isStartDateValid && (
            <Col span={24} md={12}>
              <Row>
                <Col span={24} sm={12}>
                  <FormItem
                    label="Se termine au"
                    name="endDate"
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      disabledDate={value => this.disableEndDate(value)}
                      onChange={value => this.onDateChange(value, 'endDate')}
                      allowClear={false}
                      value={moment(endDate)}
                    />
                  </FormItem>
                </Col>
                <Col span={24} sm={12}>
                  <FormItem
                    label="à"
                    name="endTime"
                  >
                    <TimePicker
                      onChange={value => this.onDateChange(value, 'endTime')}
                      format="kk:mm"
                      minuteStep={30}
                      value={moment(endTime)}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Col>
          )}
        </Row>
        {isStartDateValid && (
          <Row gutter={24} type="flex" align="bottom">
            <Col span={24} md={7}>
              <FormItem
                label="Récurrence"
                name="recurrence"
              >
                <Select
                  defaultValue="none"
                  onChange={value => this.onRecurrenceChange(value)}
                >
                  {optionsRecurrence.map(option => (
                    <Select.Option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            {recurrenceType !== RECURRENCE_NONE && (
              <Col span={24} md={5}>
                <FormItem
                  label="Fréquence"
                  name="recurrenceFrequency"
                >
                  <Input
                    type="number"
                    onChange={value => this.onRecurrenceFrequencyChange(value)}
                    defaultValue="1"
                    min="1"
                  />
                </FormItem>
              </Col>
            )}
            {recurrenceType !== RECURRENCE_NONE && (
              <Col span={24} md={7} sm={12}>
                <FormItem
                  label="Jusqu'au"
                  name="limitDate"
                >
                  <DatePicker
                    placeholder="Saisissez une date"
                    format="DD/MM/YYYY"
                    onChange={value => this.onLimitDateChange(value)}
                    disabledDate={value => this.disableEndDate(value)}
                    allowClear={false}
                  />
                </FormItem>
              </Col>
            )}
            <Col span={24} md={5} sm={12}>
              <Button
                type="primary"
                onClick={value => this.confirmDate(value)}
                style={{ marginBottom: 28 }}
                disabled={!limitDate && recurrenceType !== RECURRENCE_NONE}
              >
                Valider
              </Button>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

export default DatesListPicker;
