import React from 'react';
import { Layout as AntLayout } from 'antd';
import Header from 'components/Layout/Header/Header';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import SideMenu from 'components/SideMenu/SideMenu';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';

const Layout = ({ children }) => (
  <AntLayout style={{ height: '100vh' }}>
    <ScrollToTop />
    <Header />
    <AntLayout>
      <AntLayout.Sider
        breakpoint="md"
        collapsedWidth="0"
        style={{ background: 'white' }}
      >
        <SideMenu />
      </AntLayout.Sider>

      <AntLayout>
        <Breadcrumb />
        <AntLayout.Content style={{ margin: '0 20px', padding: '20px', background: 'white' }}>
          {children}
        </AntLayout.Content>
      </AntLayout>
    </AntLayout>

    <AntLayout.Footer>Footer content</AntLayout.Footer>
  </AntLayout>
);

export default Layout;
