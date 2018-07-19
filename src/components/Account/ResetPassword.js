import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-redux-form';
import { Button } from 'antd';
import { Redirect } from 'react-router-dom';

import { newPassword, changePassword } from 'modules/account';
import Input from 'components/Fields/Input';


class ResetPassword extends React.Component {
  handleSubmit = () => {
    const { account, uidb64, token } = this.props;
    if (uidb64 && token) {
      // if url contains token, it's a new account
      this.props.newPassword(account.password, uidb64, token);
    } else {
      // if url dosn't contain token, it's an existing
      this.props.changePassword(account.password);
    }
  }

  render () {
    const { form, account } = this.props;

    if (account.active) {
      return <Redirect to="/login" />;
    }

    return (
      <Form model="account.password">
        <Input
          model=".new_password1"
          type="password"
          label="Mot de passe"
          placeholder="Choisissez un nouveau mot de passe"
          required
        />
        <Input
          model=".new_password2"
          type="password"
          label="Confirmez votre mot de passe"
          placeholder="Confirmez votre mot de passe"
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
            Enregistrer
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
  newPassword,
  changePassword,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
