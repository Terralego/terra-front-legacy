import React from 'react';
import { Fieldset } from 'react-redux-form';
import Input from 'components/Fields/Input';
import TextArea from 'components/Fields/TextArea';

function FormProject () {
  return (
    <Fieldset model=".properties.project">
      <Input
        model=".title"
        label="Title"
        placeholder="Give a title to your project"
        errorMessages={
          {
            required: {
              message: 'Please provide a title',
            },
          }
        }
        required // 'required' props becomes useless if errorMessages.required is defined
      />

      <TextArea
        model=".description"
        label="Description"
        placeholder="Describe your project"
        errorMessages={
          {
            required: {
              message: 'Please provide a description',
            },
            length: {
              message: 'The description must have at least 60 characters',
              rule: val => val && val.length > 60,
            },
          }
        }
      />
    </Fieldset>
  );
}

export default FormProject;
