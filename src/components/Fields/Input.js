import React from 'react';
import Proptypes from 'prop-types';
import { Form, Input } from 'antd';
import { Control, Errors } from 'react-redux-form';

const FormItem = Form.Item;

function validateStatus (fieldValue) {
  if (!fieldValue.valid && fieldValue.touched && !fieldValue.focus) {
    return 'error';
  }
  return '';
}

const CustomInput = props => {
  const propsField = { ...props };
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
      help={(
        <Errors
          model={props.name}
          show={field => field.touched && !field.focus}
          messages={errorMessages}
          component={item => <div>{item.children}</div>}
        />
      )}
    >
      <Input {...propsField} />
    </FormItem>
  );
};

const InputField = props => {
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
      id={props.id || props.model}
      validators={rules}
      withFieldValue
      mapProps={{
        errorMessages: () => messages,
      }}
      component={CustomInput}
      {...props}
    />
  );
};

InputField.propTypes = {
  model: Proptypes.string.isRequired,
  label: Proptypes.string.isRequired,
  placeholder: Proptypes.string,
  errorMessages: Proptypes.shape({
    x: Proptypes.string,
  }),
  required: Proptypes.bool,
  autoFocus: Proptypes.bool,
};

InputField.defaultProps = {
  placeholder: '',
  errorMessages: {},
  required: false,
  autoFocus: false,
};

export default InputField;
