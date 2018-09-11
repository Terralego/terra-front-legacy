import React from 'react';
import Proptypes from 'prop-types';
import { Form, Checkbox } from 'antd';
import { Control, Errors } from 'react-redux-form';

const FormItem = Form.Item;

function validateStatus (fieldValue) {
  if (!fieldValue.valid && fieldValue.touched && !fieldValue.focus) {
    return 'error';
  }
  return '';
}

function defaultRenderItem (option, props) {
  return (
    <Checkbox
      key={`${props.name}_${option.value}`}
      style={{ display: 'block', margin: '10px 0' }}
      {...option}
    >
      {option.label}
    </Checkbox>
  );
}

const CustomCheckbox = props => {
  const {
    errorMessages,
    fieldValue,
    label,
    name,
    options,
    renderItem = defaultRenderItem,
    ...propsField
  } = props;
  delete propsField.withFieldValue;
  delete propsField.required;

  return (
    <FormItem
      label={label}
      validateStatus={validateStatus(fieldValue)}
      required={!!errorMessages.required}
      help={
        validateStatus(fieldValue) ?
          <Errors
            model={name}
            show={field => field.touched && !field.focus}
            messages={
            fieldValue.errors.required ? { required: errorMessages.required } : errorMessages
          }
            component={item => <div>{item.children}</div>}
          />
        : null
      }
    >

      <Checkbox.Group {...propsField}>
        {options.map(item => renderItem(item, props))}
      </Checkbox.Group>
    </FormItem>
  );
};

const CheckboxField = props => {
  const required = props.required || props.errorMessages.required;
  let validators = {};
  let messages = {};

  Object.keys(props.errorMessages).forEach(item => {
    if (props.errorMessages[item].rule) {
      validators[item] = props.errorMessages[item].rule;
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
    if (!validators.required) {
      validators = {
        ...validators,
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
      validators={validators}
      withFieldValue
      mapProps={{
        errorMessages: () => messages,
      }}
      component={CustomCheckbox}
      {...props}
    />
  );
};

CheckboxField.propTypes = {
  model: Proptypes.string.isRequired,
  label: Proptypes.string.isRequired,
  placeholder: Proptypes.string,
  errorMessages: Proptypes.shape({
    x: Proptypes.string,
  }),
  required: Proptypes.bool,
};

CheckboxField.defaultProps = {
  placeholder: '',
  errorMessages: {},
  required: false,
};

export default CheckboxField;
