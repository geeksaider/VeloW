import axios from 'axios';
import { useToast } from 'vue-toastification';
import router from '../../router';

const toast = useToast();

const state = {
  orders: [],
  currentOrder: null
};

const getters = {
  allOrders: (state) => state.orders,
  currentOrder: (state) => state.currentOrder
};

const mutations = {
  SET_ORDERS(state, orders) {
    state.orders = orders;
  },
  
  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order;
  },
  
  ADD_ORDER(state, order) {
    state.orders.unshift(order);
  }
};

const actions = {
  async fetchOrders({ commit, rootGetters, dispatch }) {
    if (!rootGetters['auth/isAuthenticated']) {
      return;
    }
    
    try {
      dispatch('setLoading', true, { root: true });
      
      const response = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${rootGetters['auth/token']}` }
      });
      
      commit('SET_ORDERS', response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Не удалось загрузить заказы');
    } finally {
      dispatch('setLoading', false, { root: true });
    }
  },
  
  async fetchOrder({ commit, rootGetters, dispatch }, orderId) {
    try {
      dispatch('setLoading', true, { root: true });
      
      const response = await axios.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${rootGetters['auth/token']}` }
      });
      
      commit('SET_CURRENT_ORDER', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      toast.error('Не удалось загрузить информацию о заказе');
      return null;
    } finally {
      dispatch('setLoading', false, { root: true });
    }
  },
  
  async createOrder({ commit, rootGetters, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true });
      
      if (!rootGetters['auth/isAuthenticated']) {
        toast.error('Для оформления заказа необходимо войти в систему');
        router.push('/login?redirect=/checkout');
        return { success: false, message: 'Требуется авторизация' };
      }
      
      const response = await axios.post('/api/orders', {}, {
        headers: { Authorization: `Bearer ${rootGetters['auth/token']}` }
      });
      
      commit('ADD_ORDER', response.data);
      
      // Clear the cart after successful order
      dispatch('cart/clearCart', null, { root: true });
      
      toast.success('Заказ успешно оформлен');
      router.push(`/account?tab=orders`);
      
      return { success: true, order: response.data };
    } catch (error) {
      console.error('Error creating order:', error);
      const message = error.response?.data?.message || 'Ошибка при оформлении заказа';
      toast.error(message);
      return { success: false, message };
    } finally {
      dispatch('setLoading', false, { root: true });
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
