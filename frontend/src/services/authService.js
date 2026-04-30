import api from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/signin', { email, password });
    if (response.data.accessToken || response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: (email, password, roles) => {
    return api.post('/auth/signup', {
      email,
      password,
      role: roles
    });
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  getToken: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? (user.accessToken || user.token) : null;
  }
};

export default authService;
