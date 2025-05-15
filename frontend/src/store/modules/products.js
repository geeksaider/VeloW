import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

const state = {
  products: [],
  product: null,
  categories: [],
  filters: {
    category: '',
    search: '',
    sort: 'default' // default, price-low, price-high
  },
  page: 1,
  limit: typeof window !== 'undefined' && window.location.pathname.startsWith('/shop') ? 24 : 10,
  total: 0
};

const getters = {
  allProducts: (state) => state.products,
  page: (state) => state.page,
  limit: (state) => state.limit,
  total: (state) => state.total,
  currentProduct: (state) => state.product,
  categories: (state) => state.categories,
  filters: (state) => state.filters,
  
  filteredProducts: (state) => {
    let result = [...state.products];
    
    // Filter by category
    if (state.filters.category) {
      result = result.filter(product => product.category === state.filters.category);
    }
    
    // Filter by search term
    if (state.filters.search) {
      const searchLower = state.filters.search.toLowerCase();
      result = result.filter(product => 
        product.title.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort products
    if (state.filters.sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (state.filters.sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }
    
    return result;
  }
};

const mutations = {
  SET_PRODUCTS(state, { products, total }) {
    state.products = products;
    state.total = total;
  },
  
  SET_PRODUCT(state, product) {
    state.product = product;
  },
  
  SET_CATEGORIES(state, categories) {
    state.categories = categories;
  },
  
  UPDATE_FILTER(state, { key, value }) {
    state.filters[key] = value;
    state.page = 1;
  },
  
  RESET_FILTERS(state) {
    state.filters = {
      category: '',
      search: '',
      sort: 'default'
    };
    state.page = 1;
  },
  
  ADD_PRODUCT(state, product) {
    state.products.unshift(product);
  },
  
  UPDATE_PRODUCT(state, updatedProduct) {
    const index = state.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      state.products.splice(index, 1, updatedProduct);
    }
    if (state.product && state.product.id === updatedProduct.id) {
      state.product = updatedProduct;
    }
  },
  
  DELETE_PRODUCT(state, productId) {
    state.products = state.products.filter(p => p.id !== productId);
    if (state.product && state.product.id === productId) {
      state.product = null;
    }
  }
};

const actions = {
  async fetchProducts({ commit, dispatch, state }) {
    try {
      dispatch('setLoading', true, { root: true });
      // Build query parameters
      const params = new URLSearchParams();
      if (state.filters.category) params.append('category', state.filters.category);
      if (state.filters.search) params.append('search', state.filters.search);
      if (state.filters.sort && state.filters.sort !== 'default') params.append('sort', state.filters.sort);
      params.append('page', state.page);
      params.append('limit', state.limit);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await axios.get(`/api/products${queryString}`);
      // Ожидаем ответ формата { products, total }
      commit('SET_PRODUCTS', { products: response.data.products, total: response.data.total });
    } catch (error) {
      console.error('Error fetching products:', error);
      dispatch('setError', 'Не удалось загрузить товары', { root: true });
    } finally {
      dispatch('setLoading', false, { root: true });
    }
  },
  
  async fetchProduct({ commit, dispatch }, productId) {
    try {
      dispatch('setLoading', true, { root: true });
      
      const response = await axios.get(`/api/products/${productId}`);
      commit('SET_PRODUCT', response.data);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      dispatch('setError', 'Не удалось загрузить информацию о товаре', { root: true });
      return null;
    } finally {
      dispatch('setLoading', false, { root: true });
    }
  },
  
  async fetchCategories({ commit, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true });
      
      const response = await axios.get('/api/products/categories');
      commit('SET_CATEGORIES', response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      dispatch('setLoading', false, { root: true });
    }
  },
  
  updateFilter({ commit, dispatch }, { key, value }) {
    commit('UPDATE_FILTER', { key, value });
    dispatch('fetchProducts');
  },
  
  resetFilters({ commit, dispatch }) {
    commit('RESET_FILTERS');
    dispatch('fetchProducts');
  },
  
  // Admin actions for CRUD operations
  async createProduct({ commit, rootGetters, dispatch }, productData) {
    try {
      dispatch('setLoading', true, { root: true });
      
      const formData = new FormData();
      
      // Append text fields
      for (const [key, value] of Object.entries(productData)) {
        if (key !== 'image') {
          formData.append(key, value);
        }
      }
      
      // Append image if it exists
      if (productData.image) {
        formData.append('image', productData.image);
      }
      
      const response = await axios.post('/api/products', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${rootGetters['auth/token']}` 
        }
      });
      
      commit('ADD_PRODUCT', response.data);
      toast.success('Товар успешно создан');
      
      return { success: true, product: response.data };
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Ошибка при создании товара');
      return { success: false };
    } finally {
      dispatch('setLoading', false, { root: true });
    }
  },
  
  async updateProduct({ commit, rootGetters, dispatch }, { productId, productData }) {
    try {
      dispatch('setLoading', true, { root: true });
      
      const formData = new FormData();
      
      // Append text fields
      for (const [key, value] of Object.entries(productData)) {
        if (key !== 'image') {
          formData.append(key, value);
        }
      }
      
      // Append image if it exists
      if (productData.image) {
        formData.append('image', productData.image);
      }
      
      const response = await axios.put(`/api/products/${productId}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${rootGetters['auth/token']}` 
        }
      });
      
      commit('UPDATE_PRODUCT', response.data);
      toast.success('Товар успешно обновлен');
      
      return { success: true, product: response.data };
    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
      toast.error('Ошибка при обновлении товара');
      return { success: false };
    } finally {
      dispatch('setLoading', false, { root: true });
    }
  },
  
  async deleteProduct({ commit, rootGetters, dispatch }, productId) {
    try {
      dispatch('setLoading', true, { root: true });
      
      await axios.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${rootGetters['auth/token']}` }
      });
      
      commit('DELETE_PRODUCT', productId);
      toast.success('Товар успешно удален');
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
      toast.error('Ошибка при удалении товара');
      return { success: false };
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
