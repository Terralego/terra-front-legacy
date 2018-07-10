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

const CustomTextArea = props => {
  const { errorMessages, fieldValue, label, name, ...propsField } = props;
  delete propsField.withFieldValue;
  delete propsField.required;


  return (
    <FormItem
      label={label}
      validateStatus={validateStatus(fieldValue)}
      required={!!errorMessages.required}
      help={
        <Errors
          model={name}
          show={field => field.touched && !field.focus}
          messages={fieldValue.errors.required ? { ...errorMessages.required } : errorMessages}
          component={item => <div>{item.children}</div>}
        />
      }
    >
      <Input.TextArea {...propsField} />
    </FormItem>
  );
};

const TextAreaField = props => {
  const required = props.required || props.errorMessages.required;
  let rules = {};
  let messages = {};

  Object.keys(props.errorMessages).forEach(item => {
    rules[item] = props.errorMessages[item].rule;
    messages[item] = props.errorMessages[item].message;
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
      id={props.id || props.model}
      validators={rules}
      withFieldValue
      mapProps={{
        errorMessages: messages,
      }}
      component={CustomTextArea}
      {...props}
    />
  );
};

TextAreaField.propTypes = {
  model: Proptypes.string.isRequired,
  label: Proptypes.string.isRequired,
  placeholder: Proptypes.string,
  errorMessages: Proptypes.shape({
    x: Proptypes.string,
  }),
  required: Proptypes.bool,
  autosize: Proptypes.shape({
    minRows: Proptypes.number,
  }),
};

TextAreaField.defaultProps = {
  label: '',
  placeholder: '',
  errorMessages: {},
  required: false,
  autosize: { minRows: 3 },
};

export default TextAreaField;
