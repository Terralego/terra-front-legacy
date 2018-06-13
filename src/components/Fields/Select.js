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
  const propsField = { ...props };
  delete propsField.withFieldValue;
  delete propsField.errorMessages;
  delete propsField.value;
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
      <Select
        showSearch
        optionFilterProp="children"
        filterOption={handleFilter}
        defaultValue={props.value}
        {...propsField}
      >{props.options.map(option => (
        props.categories ?
          <Select.OptGroup key={option.value} label={option.label}>
            {option.children.map(opt => (
              <Select.Option key={opt.value} value={`${option.value},${opt.value}`} label={opt.label} category={option.value}>
                {opt.label}
              </Select.Option>
              ))}
          </Select.OptGroup>
        : <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
      ))}
      </Select>
    </FormItem>
  );
};

function SelectField (props) {
  return (
    <Control.select
      model={props.model}
      id={props.model}
      validators={props.required && {
        required: val => val && val.length,
      }}
      withFieldValue
      mapProps={{
        errorMessages: () => props.errorMessages,
        options: () => props.options,
        categories: () => props.categories,
      }}
      component={CustomSelect}
      {...props}
    />
  );
}

SelectField.propTypes = {
  model: Proptypes.string.isRequired,
  label: Proptypes.string.isRequired,
  placeholder: Proptypes.string,
  errorMessages: Proptypes.shape({
    x: Proptypes.string,
  }),
  options: Proptypes.arrayOf(Proptypes.shape({
    value: Proptypes.string,
    label: Proptypes.string,
  })).isRequired,
  required: Proptypes.bool,
};

SelectField.defaultProps = {
  placeholder: '',
  errorMessages: {},
  required: false,
};

export default SelectField;
