import Home from 'components/Home/Home';
import About from 'components/About/About';
import Form from 'components/Form/Form';
import UserrequestList from 'components/Userrequest/UserrequestList';
import Userrequest from 'components/Userrequest/Userrequest';
import Login from 'components/Login/Login';
import FormSummary from 'components/Form/FormSummary';

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
  path: '/request',
  name: 'Request',
  component: Form,
  icon: 'form',
  protected: false,
}, {
  path: '/request-preview',
  name: 'Request Preview',
  component: FormSummary,
  icon: 'form',
  protected: false,
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
