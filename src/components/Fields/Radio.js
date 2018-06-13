import React from 'react';
import Proptypes from 'prop-types';
import { Form, Radio } from 'antd';
import { Control, Errors } from 'react-redux-form';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

function validateStatus (fieldValue) {
  if (!fieldValue.valid && fieldValue.touched && !fieldValue.focus) {
    return 'error';
  }
  return '';
}

const CustomRadio = props => {
  const propsField = { ...props };
  delete propsField.withFieldValue;
  delete propsField.errorMessages;
  delete propsField.options;
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
      <RadioGroup
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onKeyPress={props.onKeyPress}
        {...propsField}
      >
        {props.options.map(option => (
          <RadioButton value={option.value} key={`radio_${props.name}_${option.value}`}>
            {option.label}
          </RadioButton>
        ))}
      </RadioGroup>
    </FormItem>
  );
};

function RadioField (props) {
  return (
    <Control
      model={props.model}
      id={props.model}
      validators={{
        required: !props.required || (val => val && val.length),
      }}
      mapProps={{
        errorMessages: () => props.errorMessages,
        options: () => props.options,
      }}
      withFieldValue
      component={CustomRadio}
      {...props}
    />
  );
}

RadioField.propTypes = {
  model: Proptypes.string.isRequired,
  label: Proptypes.string.isRequired,
  errorMessages: Proptypes.shape({
    x: Proptypes.string,
  }),
  options: Proptypes.arrayOf(Proptypes.shape({
    value: Proptypes.string,
    label: Proptypes.string,
  })).isRequired,
  // defaultValue: Proptypes.string.isRequired,
  required: Proptypes.bool,
};

RadioField.defaultProps = {
  required: false,
  errorMessages: { required: 'Please fill this field' },
};

export default RadioField;
