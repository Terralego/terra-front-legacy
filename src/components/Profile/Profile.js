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
      required
    />
    <Input
      model=".password"
      type="password"
      label="Password"
      placeholder="Your password"
      required
    />
    <Fieldset model=".properties">
      <Input
        model=".firstname"
        label="First name"
        required
      />
      <Input
        model=".lastname"
        label="First name"
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


const mapStateToProps = state => ({
  profile: state.profile,
  form: state.forms.profile.$form,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
