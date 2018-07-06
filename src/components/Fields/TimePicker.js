import React from 'react';
import moment from 'moment';
import Proptypes from 'prop-types';
import { Form, TimePicker } from 'antd';
import { Control, Errors } from 'react-redux-form';

const FormItem = Form.Item;

function validateStatus (fieldValue) {
  if (!fieldValue.valid && fieldValue.touched && !fieldValue.focus) {
    return 'error';
  }
  return '';
}

const CustomTimePicker = props => {
  const propsField = { ...props };
  // props.value is a "moment" object
  // but it becomes a string when we register it to the store
  propsField.value = (moment.isMoment(props.value) || props.value !== '') ? moment(props.value) : null;
  delete propsField.withFieldValue;
  delete propsField.errorMessages;
  delete propsField.fieldValue;
  delete propsField.required;

  const errorMessages = (props.fieldValue.errors && props.fieldValue.errors.required)
    ? { required: props.errorMessages.required }
    : props.errorMessages;

  return (
    <FormItem
      label={props.label}
      validateStatus={validateStatus(props.fieldValue)}
      required={!!errorMessages.required}
      help={
        <Errors
          model={props.name}
          show={field => field.touched && !field.focus}
          messages={props.errorMessages}
        />
      }
    >
      <TimePicker {...propsField} />
    </FormItem>
  );
};

const TimePickerField = props => {
  const required = props.required || props.errorMessages.required;
  let rules = {};
  let messages = {};

  Object.keys(props.errorMessages).forEach(item => {
    if (props.errorMessages[item].rule) {
      rules[item] = props.errorMessages[item].rule;
    }
    if (props.errorMessages[item].message) {
      messages[item] = props.errorMessages[item].message;
    }
  });

  /*
  * If "required" is truthy
  * and "errorMessages" is not set
  * we set default message and rules
  */
  if (required) {
    if (!rules.required) {
      rules = {
        ...rules,
        required: val => val && val.length,
      };
    }
    if (!messages.required) {
      messages = {
        ...messages,
        required: 'This field is mandatory',
      };
    }
  }

  return (
    <Control
      model={props.model}
      id={props.model}
      validators={rules}
      withFieldValue
      mapProps={{
        errorMessages: () => messages,
      }}
      component={CustomTimePicker}
      {...props}
    />
  );
};

TimePickerField.propTypes = {
  model: Proptypes.string.isRequired,
  label: Proptypes.string,
  placeholder: Proptypes.string,
  format: Proptypes.string,
  required: Proptypes.bool,
  errorMessages: Proptypes.shape({
    x: Proptypes.string,
  }),
};

TimePickerField.defaultProps = {
  label: null,
  placeholder: '',
  format: 'kk',
  errorMessages: {},
  required: false,
};

export default TimePickerField;
