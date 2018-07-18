import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-redux-form';
import { Button } from 'antd';

import { resetPassword } from 'modules/account';
import Input from 'components/Fields/Input';


class ResetPassword extends React.Component {
  handleSubmit = () => {
    const { account, uidb64Token } = this.props;
    this.props.resetPassword(account.password, uidb64Token);
  }

  render () {
    const { form } = this.props;
    return (
      <Form model="account.password">
        <Input
          model=".new_password1"
          type="password"
          label="Password"
          placeholder="Your password"
          required
        />
        <Input
          model=".new_password2"
          type="password"
          label="Password"
          placeholder="Confirm your password"
          required
        />
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
  }
}

const mapStateToProps = state => ({
  account: state.account,
  form: state.forms.account.$form,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  resetPassword,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
