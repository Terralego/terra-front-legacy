import React from 'react';
import Proptypes from 'prop-types';
import { Form, Checkbox } from 'antd';
import { Control, Errors } from 'react-redux-form';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

function validateStatus (fieldValue) {
  if (!fieldValue.valid && fieldValue.touched && !fieldValue.focus) {
    return 'error';
  }
  return '';
}

const CustomCheckbox = props => {
  const propsField = { ...props };
  delete propsField.withFieldValue;
  delete propsField.errorMessages;
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
      <CheckboxGroup
        {...propsField}
      />
    </FormItem>
  );
};

function CheckboxField (props) {
  return (
    <Control
      model={props.model}
      id={props.model}
      validators={props.required && {
        required: val => val && val.length,
      }}
      withFieldValue
      mapProps={{
        errorMessages: () => props.errorMessages,
      }}
      component={CustomCheckbox}
      {...props}
    />
  );
}

CheckboxField.propTypes = {
  model: Proptypes.string.isRequired,
  label: Proptypes.string.isRequired,
  placeholder: Proptypes.string,
  errorMessages: Proptypes.shape({
    required: Proptypes.string,
  }),
};

CheckboxField.defaultProps = {
  placeholder: '',
  errorMessages: { required: 'Please fill this field' },
};

export default CheckboxField;
