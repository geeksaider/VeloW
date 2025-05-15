<template>
  <div class="velo-container py-12 md:py-16">
    <h1 class="text-3xl font-light text-[color:var(--color-dark)] mb-16 text-center">Каталог товаров</h1>
    
    <!-- Filters and Search -->
    <div class="bg-white border border-[color:var(--color-secondary)] p-6 md:p-8 mb-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div class="md:col-span-4">
          <label for="search" class="velo-label mb-2">Поиск</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              id="search" 
              v-model="searchQuery" 
              placeholder="Поиск товаров..." 
              class="velo-input w-full pl-10 pr-3 py-3"
              @input="debounceSearch"
            >
          </div>
        </div>
        
        <div class="md:col-span-3">
          <label for="category" class="velo-label mb-2">Категория</label>
          <select 
            id="category" 
            v-model="selectedCategory" 
            class="velo-input w-full py-3 px-3" 
            @change="applyFilters"
          >
            <option value="">Все категории</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        
        <div class="md:col-span-3">
          <label for="sort" class="velo-label mb-2">Сортировать по</label>
          <select 
            id="sort" 
            v-model="sortOrder" 
            class="velo-input w-full py-3 px-3" 
            @change="applyFilters"
          >
            <option value="default">По умолчанию</option>
            <option value="price-low">Сначала дешевые</option>
            <option value="price-high">Сначала дорогие</option>
          </select>
        </div>

        <div class="md:col-span-1 flex items-end">
          <button 
            class="velo-btn velo-btn-secondary w-full h-[46px] flex items-center justify-center gap-2" 
            @click="resetFilters"
            title="Сбросить фильтры"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            
          </button>
        </div>
      </div>
    </div>
    
    <!-- Products Grid -->
    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="animate-spin h-12 w-12 border-t-2 rounded-full border-b-2 border-[color:var(--color-accent)]"></div>
    </div>
    
    <div v-else-if="products.length === 0" class="text-center py-32">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-[color:var(--color-light-text)] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <p class="text-xl text-[color:var(--color-light-text)] mb-6">Товары не найдены</p>
    </div>
    
    <transition-group name="fade" tag="div" v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="group"
      >
        <div class="relative mb-4 overflow-hidden bg-[color:var(--color-primary)] border border-[color:var(--color-secondary)]" style="aspect-ratio: 1/1;">
          <img 
            :src="product.image_url || 'https://via.placeholder.com/400x400?text=Velo'" 
            :alt="product.title" 
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          >
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div class="flex gap-3">
              <router-link 
                :to="`/product/${product.id}`" 
                class="bg-white text-black p-3  shadow-md hover:bg-[color:var(--color-accent)] hover:text-white transition duration-150"
                aria-label="Подробнее"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </router-link>
              
              <button 
                @click="addToCart(product)"
                class="bg-white text-black p-3 shadow-md hover:bg-[color:var(--color-accent)] hover:text-white transition duration-150"
                aria-label="Добавить в корзину"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <router-link :to="`/product/${product.id}`" class="block">
          <h3 class="font-medium text-[color:var(--color-dark)] mb-1 line-clamp-1">{{ product.title }}</h3>
          <p class="text-[color:var(--color-light-text)] text-sm mb-1">{{ formatPrice(product.price) }} ₽</p>
        </router-link>
      </div>
    </transition-group>
    
    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-8 animate-fade-in">
      <div class="flex gap-2">
        <button
          class="velo-btn velo-btn-secondary px-3 py-1"
          :disabled="page === 1"
          @click="changePage(page - 1)"
        >Назад</button>
        <button
          v-for="p in visiblePages"
          :key="p"
          class="velo-btn px-3 py-1"
          :class="p === page ? 'velo-btn-primary' : 'velo-btn-secondary'"
          @click="changePage(p)"
          :disabled="p === page"
        >{{ p }}</button>
        <button
          class="velo-btn velo-btn-secondary px-3 py-1"
          :disabled="page === totalPages"
          @click="changePage(page + 1)"
        >Вперед</button>
      </div>
      <div class="text-xs text-[color:var(--color-light-text)] mt-2 text-center w-full">Страница {{ page }} из {{ totalPages }} (всего {{ total }} товаров)</div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

export default {
  name: 'ShopView',
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    
    // State
    const searchQuery = ref('');
    const selectedCategory = ref('');
    const sortOrder = ref('default');
    const searchTimeout = ref(null);
    
    // Computed properties
    const products = computed(() => store.getters['products/filteredProducts']);
    const categories = computed(() => store.getters['products/categories']);
    const loading = computed(() => store.getters.isLoading);

    // Pagination
    const page = computed(() => store.getters['products/page']);
    const limit = computed(() => store.getters['products/limit']);
    const total = computed(() => store.getters['products/total']);
    const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)));
    const visiblePages = computed(() => {
      const pages = [];
      let start = Math.max(1, page.value - 2);
      let end = Math.min(totalPages.value, start + 4);
      if (end - start < 4) start = Math.max(1, end - 4);
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    });
    const changePage = (newPage) => {
      if (newPage === page.value || newPage < 1 || newPage > totalPages.value) return;
      store.state.products.page = newPage;
      store.dispatch('products/fetchProducts');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    
    // Methods
    const fetchData = async () => {
      await Promise.all([
        store.dispatch('products/fetchProducts'),
        store.dispatch('products/fetchCategories')
      ]);
    };
    
    const debounceSearch = () => {
      clearTimeout(searchTimeout.value);
      searchTimeout.value = setTimeout(() => {
        applyFilters();
      }, 500);
    };
    
    const applyFilters = () => {
      // Update route query parameters
      router.push({
        query: {
          ...route.query,
          search: searchQuery.value || undefined,
          category: selectedCategory.value || undefined,
          sort: sortOrder.value !== 'default' ? sortOrder.value : undefined
        }
      });
      
      // Apply filters in Vuex
      store.dispatch('products/updateFilter', { key: 'search', value: searchQuery.value });
      store.dispatch('products/updateFilter', { key: 'category', value: selectedCategory.value });
      store.dispatch('products/updateFilter', { key: 'sort', value: sortOrder.value });
    };
    
    const resetFilters = () => {
      searchQuery.value = '';
      selectedCategory.value = '';
      sortOrder.value = 'default';
      
      router.push({ query: {} });
      
      store.dispatch('products/resetFilters');
    };
    
    const addToCart = (product) => {
      store.dispatch('cart/addToCart', { product, quantity: 1 });
    };
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('ru-RU').format(price);
    };
    
    // Lifecycle hooks
    onMounted(async () => {
      // Apply query parameters from URL if they exist
      if (route.query.search) {
        searchQuery.value = route.query.search;
        store.dispatch('products/updateFilter', { key: 'search', value: route.query.search });
      }
      
      if (route.query.category) {
        selectedCategory.value = route.query.category;
        store.dispatch('products/updateFilter', { key: 'category', value: route.query.category });
      }
      
      if (route.query.sort) {
        sortOrder.value = route.query.sort;
        store.dispatch('products/updateFilter', { key: 'sort', value: route.query.sort });
      }
      
      await fetchData();
    });
    
    // Watch for route query changes from external sources
    watch(() => route.query, (newQuery) => {
      if (newQuery.search !== undefined && newQuery.search !== searchQuery.value) {
        searchQuery.value = newQuery.search;
      }
      
      if (newQuery.category !== undefined && newQuery.category !== selectedCategory.value) {
        selectedCategory.value = newQuery.category;
      }
      
      if (newQuery.sort !== undefined && newQuery.sort !== sortOrder.value) {
        sortOrder.value = newQuery.sort;
      }
    }, { deep: true });
    
    return {
      searchQuery,
      selectedCategory,
      sortOrder,
      products,
      categories,
      loading,
      applyFilters,
      debounceSearch,
      resetFilters,
      addToCart,
      formatPrice,
      page,
      limit,
      total,
      totalPages,
      visiblePages,
      changePage
    };
  }
};
</script>

<style scoped>
/* Tailwind CSS handles most styling needs */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4,0,0.2,1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.4,0,0.2,1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: none; }
}

/* Кнопки пагинации как в админке */
.velo-btn { @apply  px-3 py-1 font-medium transition; }
.velo-btn-primary { @apply bg-[color:var(--color-accent)] text-white shadow-md; }
.velo-btn-secondary { @apply bg-white border border-[color:var(--color-secondary)] text-gray-500 hover:bg-[color:var(--color-accent)] hover:text-white; }
</style>
