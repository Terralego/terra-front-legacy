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
      <Input.TextArea {...propsField} />
    </FormItem>
  );
};

function TextAreaField (props) {
  return (
    <Control
      model={props.model}
      id={props.model}
      validators={{
        required: val => val && val.length,
      }}
      withFieldValue
      mapProps={{
        errorMessages: prop => prop.errorMessages,
      }}
      component={CustomTextArea}
      {...props}
    />
  );
}

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
  placeholder: '',
  errorMessages: {},
  required: false,
  autosize: { minRows: 3 },
};

export default TextAreaField;
