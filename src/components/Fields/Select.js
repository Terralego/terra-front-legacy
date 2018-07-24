import React from 'react';
import Proptypes from 'prop-types';
import { Form, Select } from 'antd';
import { Control, Errors } from 'react-redux-form';

const FormItem = Form.Item;

function validateStatus (fieldValue) {
  if (!fieldValue.valid && fieldValue.touched && !fieldValue.focus) {
    return 'error';
  }
  return '';
}

const handleFilter = (inputValue, option) => option.props.children
  .toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;

const CustomSelect = props => {
  const { errorMessages, fieldValue, label, name, ...propsField } = props;
  delete propsField.withFieldValue;
  delete propsField.value;
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
      <Select
        optionFilterProp="children"
        filterOption={handleFilter}
        value={props.value ? props.value : undefined}
        {...propsField}
      >{props.options.map(option => (
        props.categories ?
          <Select.OptGroup
            key={option.value}
            label={
              <span style={{ fontWeight: 'bold', color: '#2b2b2b', fontSize: 14 }}>{option.label}</span>
            }
          >
            {option.children.map(opt => (
              <Select.Option
                key={opt.value}
                value={`${option.value},${opt.value}`}
                label={opt.label}
                category={option.value}
              >
                {opt.label}
              </Select.Option>
              ))}
          </Select.OptGroup>
        :
          <Select.Option key={option.value.toString()} value={option.value.toString()}>
            {option.label}
          </Select.Option>
      ))}
      </Select>
    </FormItem>
  );
};

const SelectField = props => {
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
    <Control.select
      id={props.id || props.model}
      validators={validators}
      withFieldValue
      mapProps={{
        errorMessages: () => messages,
        options: () => props.options,
        categories: () => props.categories,
      }}
      component={CustomSelect}
      {...props}
    />
  );
};

SelectField.propTypes = {
  model: Proptypes.string.isRequired,
  label: Proptypes.string,
  placeholder: Proptypes.string,
  errorMessages: Proptypes.shape({
    x: Proptypes.string,
  }),
  options: Proptypes.arrayOf(Proptypes.shape({
    value: Proptypes.oneOfType([
      Proptypes.string,
      Proptypes.number,
      Proptypes.bool,
    ]),
    label: Proptypes.string,
  })).isRequired,
  required: Proptypes.bool,
};

SelectField.defaultProps = {
  placeholder: '',
  label: '',
  errorMessages: {},
  required: false,
};

export default SelectField;
