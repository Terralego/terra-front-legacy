import Home from 'components/Home/Home';
import About from 'components/About/About';
import Profile from 'components/Profile/Profile';
import Form from 'components/Form/Form';
import UserrequestList from 'components/Userrequest/UserrequestList';
import Userrequest from 'components/Userrequest/Userrequest';
import Login from 'components/Login/Login';

export const routes = [{
  path: '/',
  name: 'Home',
  component: Home,
  icon: 'home',
  exact: true,
  protected: false,
}, {
  path: '/about',
  name: 'About',
  component: About,
  icon: 'paper-clip',
  protected: false,
}, {
  path: '/profile',
  name: 'Profile',
  component: Profile,
  icon: 'paper-clip',
  protected: false,
}, {
  path: '/new-request',
  name: 'New request',
  component: Form,
  icon: 'form',
  protected: false,
  hideHeader: true,
}, {
  path: '/request/:id',
  name: 'Edit existing request',
  component: Form,
  icon: 'form',
  protected: true,
  hideHeader: true,
}, {
  path: '/manage-request',
  name: 'Manage requests',
  component: UserrequestList,
  icon: 'form',
  exact: true,
  protected: true,
  routes: [
    {
      path: '/manage-request/detail/:id',
      name: 'Manage request detail',
      component: Userrequest,
      protected: true,
    },
  ],
}, {
  path: '/login',
  name: 'Login',
  component: Login,
  icon: 'form',
}];

export default routes;
