import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'modules/routes';
import { Icon, Menu } from 'antd';

const SideMenu = () => (
  <Menu mode="inline" defaultSelectedKeys={['1']} >
    {routes.map(route => {
      if (route.routes && route.submenu) {
        return (
          <Menu.SubMenu key={route.path} title={<span>{route.icon && <Icon type={route.icon} />}{route.name}</span>}>
            {route.routes.map(subroute => (

              <Menu.Item key={subroute.path}>
                <Link to={subroute.path}>
                  {subroute.icon && <Icon type={subroute.icon} />}
                  {subroute.name}
                </Link>
              </Menu.Item>

            ))}
          </Menu.SubMenu>
        );
      }

      return (
        <Menu.Item key={route.path}>
          <Link to={route.path}>
            {route.icon && <Icon type={route.icon} />}
            {route.name}
          </Link>
        </Menu.Item>
      );
    })}
  </Menu>
);

export default SideMenu;
