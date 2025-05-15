import axios from 'axios';
import { useToast } from 'vue-toastification';
import { v4 as uuidv4 } from 'uuid';

const toast = useToast();

// Generate a guest token if none exists
const getGuestToken = () => {
  let guestToken = localStorage.getItem('guest_token');
  if (!guestToken) {
    guestToken = uuidv4();
    localStorage.setItem('guest_token', guestToken);
  }
  return guestToken;
};

const state = {
  items: JSON.parse(localStorage.getItem('cart_items')) || []
};

const getters = {
  cartItems: (state) => state.items,
  cartItemsCount: (state) => state.items.reduce((count, item) => count + item.quantity, 0),
  cartTotal: (state) => {
    return state.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
};

const mutations = {
  SET_CART_ITEMS(state, items) {
    state.items = items;
    localStorage.setItem('cart_items', JSON.stringify(items));
  },
  
  ADD_TO_CART(state, { product, quantity }) {
    const existingItem = state.items.find(item => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      state.items.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        image_url: product.image_url,
        quantity
      });
    }
    
    localStorage.setItem('cart_items', JSON.stringify(state.items));
  },
  
  UPDATE_CART_ITEM(state, { productId, quantity }) {
    const item = state.items.find(item => item.productId === productId);
    
    if (item) {
      item.quantity = quantity;
      
      if (quantity <= 0) {
        state.items = state.items.filter(item => item.productId !== productId);
      }
      
      localStorage.setItem('cart_items', JSON.stringify(state.items));
    }
  },
  
  REMOVE_FROM_CART(state, productId) {
    state.items = state.items.filter(item => item.productId !== productId);
    localStorage.setItem('cart_items', JSON.stringify(state.items));
  },
  
  CLEAR_CART(state) {
    state.items = [];
    localStorage.removeItem('cart_items');
  },
  
  CLEAR_USER_CART(state) {
    // Only clears the state, not localStorage
    state.items = [];
  }
};

const actions = {
  async fetchCart({ commit, rootGetters, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true });
      
      if (rootGetters['auth/isAuthenticated']) {
        // For authenticated users, fetch cart from API
        const response = await axios.get('/api/cart', {
          headers: { Authorization: `Bearer ${rootGetters['auth/token']}` }
        });
        commit('SET_CART_ITEMS', response.data);
      } else {
        // For guests, try to fetch from API with guest token
        const guestToken = getGuestToken();
        try {
          const response = await axios.get(`/api/cart/guest/${guestToken}`);
          commit('SET_CART_ITEMS', response.data);
        } catch (error) {
          // If API fails, use local storage (fallback)
          console.error('Error fetching guest cart:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      dispatch('setLoading', false, { root: true });
    }
  },
  
  async addToCart({ commit, rootGetters, dispatch }, { product, quantity = 1 }) {
    try {
      if (rootGetters['auth/isAuthenticated']) {
        // For authenticated users
        await axios.post('/api/cart', {
          productId: product.id,
          quantity
        }, {
          headers: { Authorization: `Bearer ${rootGetters['auth/token']}` }
        });
      } else {
        // For guests
        const guestToken = getGuestToken();
        await axios.post(`/api/cart/guest`, {
          guestToken,
          productId: product.id,
          quantity
        });
      }
      
      commit('ADD_TO_CART', { product, quantity });
      toast.success('Товар добавлен в корзину');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Не удалось добавить товар в корзину');
    }
  },
  
  async updateCartItem({ commit, rootGetters }, { productId, quantity }) {
    try {
      if (rootGetters['auth/isAuthenticated']) {
        if (quantity <= 0) {
          await axios.delete(`/api/cart/${productId}`, {
            headers: { Authorization: `Bearer ${rootGetters['auth/token']}` }
          });
        } else {
          await axios.put(`/api/cart/${productId}`, { quantity }, {
            headers: { Authorization: `Bearer ${rootGetters['auth/token']}` }
          });
        }
      } else {
        const guestToken = getGuestToken();
        if (quantity <= 0) {
          await axios.delete(`/api/cart/guest/${guestToken}/${productId}`);
        } else {
          await axios.put(`/api/cart/guest/${guestToken}/${productId}`, { quantity });
        }
      }
      
      commit('UPDATE_CART_ITEM', { productId, quantity });
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error('Ошибка при обновлении корзины');
    }
  },
  
  async removeFromCart({ commit, rootGetters }, productId) {
    try {
      if (rootGetters['auth/isAuthenticated']) {
        await axios.delete(`/api/cart/${productId}`, {
          headers: { Authorization: `Bearer ${rootGetters['auth/token']}` }
        });
      } else {
        const guestToken = getGuestToken();
        await axios.delete(`/api/cart/guest/${guestToken}/${productId}`);
      }
      
      commit('REMOVE_FROM_CART', productId);
      toast.success('Товар удален из корзины');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Ошибка при удалении товара из корзины');
    }
  },
  
  async clearCart({ commit, rootGetters }) {
    try {
      if (rootGetters['auth/isAuthenticated']) {
        await axios.delete('/api/cart', {
          headers: { Authorization: `Bearer ${rootGetters['auth/token']}` }
        });
      } else {
        const guestToken = getGuestToken();
        await axios.delete(`/api/cart/guest/${guestToken}`);
      }
      
      commit('CLEAR_CART');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Ошибка при очистке корзины');
    }
  },
  
  async migrateGuestCart({ state, dispatch, rootGetters }) {
    // Called after login to move guest cart to user cart
    if (!rootGetters['auth/isAuthenticated'] || state.items.length === 0) return;
    
    try {
      const guestToken = localStorage.getItem('guest_token');
      if (guestToken) {
        await axios.post('/api/cart/migrate', { guestToken }, {
          headers: { Authorization: `Bearer ${rootGetters['auth/token']}` }
        });
        
        // Refresh the cart from server
        dispatch('fetchCart');
        
        // Clear guest token
        localStorage.removeItem('guest_token');
      }
    } catch (error) {
      console.error('Error migrating guest cart:', error);
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
