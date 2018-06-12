import React from 'react';
import { Divider, Button } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-redux-form';
import { withRouter } from 'react-router-dom';

import { getUserrequest, clear } from 'modules/userrequest';
import HeaderForm from 'components/Form/HeaderForm';
import FormConfig from 'components/Form/Form.config';

class FormApp extends React.Component {
  componentDidMount () {
    if (this.props.match.params.id) {
      // If we route on a draft userrequest, load data
      if (!this.props.data && !this.props.loading) {
        this.props.getUserrequest(this.props.match.params.id);
      }
    } else {
      // Else, clear fields to get a blank form
      this.props.clear();
    }
  }

  shouldComponentUpdate () {
    return false;
  }

  handleSubmit = () => {
    this.props.history.push('/request-preview');
  }

  render () {
    return (
      <div>
        <HeaderForm />
        <Form
          model="userrequest"
          onSubmit={userrequest => this.handleSubmit(userrequest)}
        >
          {FormConfig.steps.map(step => (
            <div key={`step_${step.title}`}>
              <h2>{step.title}</h2>
              <Divider />
              <step.component />
            </div>
          ))}

          <Button type="primary" htmlType="submit">{FormConfig.confirmation.previewButton}</Button>
        </Form>
      </div>
    );
  }
}

const StateToProps = (state, ownProps) => ({
  // TODO: use Reselect for increase performances
  data: state.userrequestList.items[ownProps.match.params.id],
  loading: state.userrequestList.loading,
});

const DispatchToProps = dispatch =>
  bindActionCreators({ getUserrequest, clear }, dispatch);

export default withRouter(connect(StateToProps, DispatchToProps)(FormApp));
