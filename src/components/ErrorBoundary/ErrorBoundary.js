import React from 'react';
import { Alert } from 'antd';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  componentDidCatch () {
    // Display fallback UI
    this.setState({ hasError: true });
  }

  render () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Alert
          style={this.props.style || { margin: 10 }}
          description={this.props.message || 'Something went wrong.'}
          type="error"
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
