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
      <Input {...propsField} />
    </FormItem>
  );
};

function InputField (props) {
  return (
    <Control
      model={props.model}
      id={props.model}
      validators={{
        required: !props.required || (val => val && val.length),
      }}
      withFieldValue
      mapProps={{
        errorMessages: () => props.errorMessages,
      }}
      component={CustomInput}
      {...props}
    />
  );
}

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
