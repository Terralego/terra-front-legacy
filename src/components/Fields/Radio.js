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
  const { errorMessages, fieldValue, label, name, ...propsField } = props;
  delete propsField.withFieldValue;
  delete propsField.options;
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
          messages={fieldValue.errors.required ? { required: errorMessages.required } : errorMessages}
          component={item => <div>{item.children}</div>}
        />
      }
    >
      <RadioGroup {...propsField}>
        {props.options.map(option => (
          <RadioButton value={option.value} key={`${props.name}_${option.value}`}>
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
      id={props.id || props.model}
      validators={{
        required: val => ((val && val.length) || !props.required),
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
