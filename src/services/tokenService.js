import Cookies from 'js-cookie';

const cookieOptions = {
  // domain: '.makina-corpus.net',
};

class TokenService {
  constructor () {
    this.token = localStorage.getItem('token') || null;
    // this.token = Cookies.get('jwt') || null;
  }
  setToken (token) {
    this.token = token;
    localStorage.setItem('token', token);
    Cookies.set('jwt', token, cookieOptions);
  }
  removeToken () {
    this.token = null;
    localStorage.removeItem('token');
    Cookies.remove('jwt', cookieOptions);
  }
  getToken () {
    return this.token;
  }
  isAuthenticated () {
    return !!this.token;
  }
}

export default new TokenService();
