import React from 'react';
import moment from 'moment';
import Proptypes from 'prop-types';
import { Form, DatePicker } from 'antd';
import { Control, Errors } from 'react-redux-form';

const FormItem = Form.Item;

function validateStatus (fieldValue) {
  if (!fieldValue.valid && fieldValue.touched && !fieldValue.focus) {
    return 'error';
  }
  return '';
}

const CustomDatePicker = props => {
  const propsField = { ...props };
  // props.value is a "moment" object
  // but it becomes a string when we register it to the store
  propsField.value = (moment.isMoment(props.value) || props.value !== '') ? moment(props.value) : null;
  delete propsField.withFieldValue;
  delete propsField.errorMessages;
  delete propsField.fieldValue;
  delete propsField.required;

  return (
    <FormItem
      label={props.label}
      validateStatus={validateStatus(props.fieldValue)}
      required={props.required}
      help={
        props.required && (
          <Errors
            model={props.name}
            show={field => field.touched && !field.focus}
            messages={props.errorMessages}
          />
        )
      }
    >
      <DatePicker
        {...propsField}
      />
    </FormItem>
  );
};

const DatePickerField = props => (
  <Control
    model={props.model}
    id={props.model}
    validators={{
        required: val => ((val && (moment.isMoment(val) || val.length)) || !props.required),
      }}
    withFieldValue
    mapProps={{
        errorMessages: () => props.errorMessages,
      }}
    component={CustomDatePicker}
    {...props}
  />
);

DatePickerField.propTypes = {
  model: Proptypes.string.isRequired,
  label: Proptypes.string,
  placeholder: Proptypes.string,
  format: Proptypes.string,
  required: Proptypes.bool,
  errorMessages: Proptypes.shape({
    x: Proptypes.string,
  }),
  autoFocus: Proptypes.oneOfType([
    Proptypes.bool,
    Proptypes.func,
  ]),
};

DatePickerField.defaultProps = {
  label: null,
  placeholder: '',
  format: 'DD-MM-YYYY',
  errorMessages: { required: 'Please fill this field' },
  required: false,
  autoFocus: false,
};

export default DatePickerField;
