import React from 'react';
import Input from 'components/Fields/Input';
import { Fieldset } from 'react-redux-form';

function FormWhere () {
  return (
    <Fieldset model=".properties.address">
      <Input
        model=".city"
        label="City"
        placeholder="What is your city?"
        errorMessages={{ required: { message: 'Please provide a city' } }}
      />
      <Input
        model=".state"
        label="State"
        placeholder="What is you state?"
        errorMessages={{ required: { message: 'Please provide a state' } }}
      />
    </Fieldset>
  );
}
export default FormWhere;
