import React from 'react';
import { Layout } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { logout } from 'modules/authentication';
import Header from 'components/Header/Header';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import SideMenu from 'components/SideMenu/SideMenu';
import RouteViews from 'components/RouteViews/RouteViews';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';

const Main = props => (
  <Layout style={{ height: '100vh' }}>
    <ScrollToTop />
    <Header {...props} />
    <Layout>
      <Layout.Sider
        breakpoint="md"
        collapsedWidth="0"
        style={{ background: 'white' }}
      >
        <SideMenu />
      </Layout.Sider>

      <Layout>
        <Breadcrumb />
        <Layout.Content style={{ margin: '0 20px', padding: '20px', background: 'white' }}>
          <RouteViews {...props} />
        </Layout.Content>
      </Layout>
    </Layout>

    <Layout.Footer>Footer content</Layout.Footer>
  </Layout>
);

const mapStateToProps = state => ({
  isAuthenticated: state.authentication.isAuthenticated,
  user: state.authentication.payload && state.authentication.payload.user,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ logout }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
