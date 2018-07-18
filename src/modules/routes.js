import Home from 'components/Home/Home';
import About from 'components/About/About';
import Profile from 'components/Profile/Profile';
import Form from 'components/Form/Form';
import UserrequestList from 'components/Userrequest/UserrequestList';
import Userrequest from 'components/Userrequest/Userrequest';
import Login from 'components/Login/Login';
import CreateAccount from 'components/Account/CreateAccount';
import Account from 'components/Account/Account';

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
  path: '/create-account/:uidb64/:token/',
  name: 'Create an account',
  component: CreateAccount,
  icon: 'paper-clip',
  protected: false,
}, {
  path: '/account',
  name: 'Account',
  component: Account,
  icon: 'account',
  protected: true,
}, {
  path: '/profile',
  name: 'Profile',
  component: Profile,
  icon: 'paper-clip',
  protected: true,
}, {
  path: '/new-request',
  name: 'New request',
  component: Form,
  icon: 'form',
  protected: true,
  hideHeader: true,
  hideFooter: true,
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
      hideHeader: true,
      hideFooter: true,
    },
  ],
}, {
  path: '/login',
  name: 'Login',
  component: Login,
  icon: 'form',
}];

export default routes;
