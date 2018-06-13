import React from 'react';
import { Fieldset } from 'react-redux-form';
import Input from 'components/Fields/Input';

function FormProject () {
  return (
    <Fieldset model=".properties.project">
      <Input
        model=".title"
        label="Title"
        placeholder="Give a title to your project"
        errorMessages={{ required: 'Please provide a title' }}
      />

      <Input
        model=".description"
        label="Description"
        placeholder="Describe your project"
        errorMessages={{ required: 'Please provide a description' }}
      />
    </Fieldset>
  );
}

export default FormProject;
