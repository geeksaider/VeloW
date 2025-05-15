import axios from '../../utils/axios';
import router from '../../router';
import jwt_decode from 'jwt-decode';
import { useToast } from 'vue-toastification';

// Инициализация toast
const toast = useToast();

// Helper to check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

const state = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null
};

const getters = {
  isAuthenticated: (state) => !!state.token && !isTokenExpired(state.token),
  currentUser: (state) => state.user,
  token: (state) => state.token,
  isAdmin: (state) => state.user && state.user.role === 'admin'
};

const mutations = {
  SET_AUTH(state, { token, user }) {
    state.token = token;
    state.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  CLEAR_AUTH(state) {
    state.token = null;
    state.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

const actions = {
  async login({ commit, dispatch }, credentials) {
    try {
      dispatch('setLoading', true, { root: true });
      const response = await axios.post('/api/auth/login', credentials);
      const { token, user } = response.data;
      
      commit('SET_AUTH', { token, user });
      
      // Integrate with cart if there are items in the guest cart
      dispatch('cart/migrateGuestCart', null, { root: true });
      
      toast.success('Вы успешно вошли в систему');
      
      // Redirect if there was a previous page the user was trying to access
      const redirectPath = router.currentRoute.value.query.redirect || '/';
      router.push(redirectPath);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Ошибка при входе в систему';
      toast.error(message);
      return { success: false, message };
    } finally {
      dispatch('setLoading', false, { root: true });
    }
  },
  
  async register({ commit, dispatch }, userData) {
    try {
      console.log('Начало регистрации:', userData.email);
      dispatch('setLoading', true, { root: true });
      
      // Убедимся, что данные формируются правильно
      const registerData = {
        email: userData.email,
        password: userData.password
      };
      
      console.log('Отправляемые данные:', JSON.stringify(registerData));
      
      // Отправляем запрос на регистрацию - полный путь
      const response = await axios.post('auth/register', registerData);
      console.log('Ответ от сервера:', response.data);
      
      if (response.data && response.data.token && response.data.user) {
        const { token, user } = response.data;
        
        // Сохраняем данные аутентификации
        commit('SET_AUTH', { token, user });
        
        // Интегрируем корзину гостя, если есть товары
        dispatch('cart/migrateGuestCart', null, { root: true });
        
        toast.success('Регистрация прошла успешно');
        router.push('/');
        
        return { success: true };
      } else {
        // Неожиданный формат ответа
        console.error('Неожиданный формат ответа:', response.data);
        toast.error('Некорректный ответ сервера при регистрации');
        return { success: false, message: 'Некорректный ответ сервера' };
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      
      // Детальное логирование ошибки
      if (error.response) {
        console.error('HTTP статус:', error.response.status);
        console.error('Данные ответа:', error.response.data);
      }
      
      let message = 'Ошибка при регистрации';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = `Ошибка: ${error.message}`;
      }
      
      if (error.response?.status === 500) {
        message = 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже или свяжитесь с администратором.';
      } else if (error.response?.status === 400) {
        message = error.response.data.message || 'Неверные данные для регистрации';
      }
      
      toast.error(message);
      return { success: false, message };
    } finally {
      dispatch('setLoading', false, { root: true });
    }
  },
  
  logout({ commit }) {
    commit('CLEAR_AUTH');
    
    // Clear cart state but not localStorage (maintain guest cart)
    commit('cart/CLEAR_USER_CART', null, { root: true });
    
    toast.info('Вы вышли из системы');
    router.push('/');
  },
  
  async updatePassword({ dispatch, getters }, { currentPassword, newPassword }) {
    try {
      dispatch('setLoading', true, { root: true });
      await axios.put('/api/auth/password', { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${getters.token}` }
      });
      
      toast.success('Пароль успешно обновлен');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Ошибка при обновлении пароля';
      toast.error(message);
      return { success: false, message };
    } finally {
      dispatch('setLoading', false, { root: true });
    }
  },
  
  checkAuth({ commit, state }) {
    if (state.token && isTokenExpired(state.token)) {
      commit('CLEAR_AUTH');
      toast.info('Сессия истекла. Пожалуйста, войдите снова.');
      router.push('/login');
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
