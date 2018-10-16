import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Permissions from 'components/Permissions';
import Error401 from 'components/Error401';

export class SubRoutes extends React.Component {
  state = {
    subComponents: [],
  };

  componentDidMount () {
    const { routes, path, ...props } = this.props;

    const subComponents = routes.map(({ component: Component, permissions, groups, ...route }) => (
      <Route
        {...route}
        key={route.path}
        path={`${path}${route.path}`}
        component={componentProps => (
          <Permissions
            permissions={permissions}
            groups={groups}
            renderFail={Error401}
          >
            <Component {...componentProps} />
          </Permissions>
        )}
      />
    ));
    subComponents.push(<Route
      key={path}
      path={path}
      {...props}
    />);

    this.setState({ subComponents });
  }

  render () {
    const { subComponents } = this.state;

    return (
      <Switch>
        {subComponents.map(Component => Component)}
      </Switch>
    );
  }
}

export default SubRoutes;
