import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Fieldset } from 'react-redux-form';
import { Button } from 'antd';

import Input from 'components/Fields/Input';

const Profile = ({ form }) => (
  <Form model="profile">
    <Input
      model=".email"
      type="email"
      label="Email"
      placeholder="Your email address"
      errorMessages={{ required: 'This field is mandatory' }}
      required
    />
    <Input
      model=".password"
      type="password"
      label="Password"
      placeholder="Your password"
      errorMessages={{ required: 'This field is mandatory' }}
      required
    />
    <Fieldset model=".properties">
      <Input
        model=".firstname"
        label="First name"
        errorMessages={{ required: 'This field is mandatory' }}
        required
      />
      <Input
        model=".lastname"
        label="First name"
        errorMessages={{ required: 'This field is mandatory' }}
        required
      />
    </Fieldset>
    <div style={{ marginTop: 24, textAlign: 'right' }}>
      <Button
        type="primary"
        htmlType="submit"
        icon="arrow-right"
        loading={form.pending}
        disabled={!form.valid}
        onClick={this.handleSubmit}
      >
        Update profile
      </Button>
    </div>
  </Form>
);


const StateToProps = state => ({
  profile: state.profile,
  form: state.forms.profile.$form,
});

const DispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(StateToProps, DispatchToProps)(Profile);
