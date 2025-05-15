<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-xl font-medium text-[color:var(--color-dark)]">Управление товарами</h2>
      <button 
        @click="showProductForm(null)" 
        class="velo-btn velo-btn-primary flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
        </svg>
        Добавить товар
      </button>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-[color:var(--color-accent)]"></div>
    </div>
    
    <div v-else>
      <!-- Search and Filters -->
      <div class="bg-[color:var(--color-primary)] p-6 mb-8 border border-[color:var(--color-secondary)]">
        <div class="flex flex-wrap gap-4">
          <div class="w-full md:w-auto flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Поиск товаров..." 
                class="velo-input pl-10 pr-3 py-2 w-full"
                @input="debounceSearch"
              >
            </div>
          </div>
          
          <div class="w-full md:w-auto md:flex-1">
            <select 
              v-model="selectedCategory" 
              class="velo-input py-2 px-3 w-full" 
              @change="applyFilters"
            >
              <option value="">Все категории</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <button 
            class="velo-btn velo-btn-secondary w-full md:w-auto" 
            @click="resetFilters"
          >
            Сбросить
          </button>
        </div>
      </div>
      
      <!-- Products List -->
      <div v-if="loading" class="flex justify-center items-center py-32">
        <div class="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-[color:var(--color-accent)]"></div>
      </div>
      <div v-else class="overflow-x-auto bg-white border border-[color:var(--color-secondary)]">
        <div v-if="filteredProducts.length === 0" class="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-[color:var(--color-light-text)] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="text-[color:var(--color-light-text)] text-lg">Товары не найдены</p>
        </div>
        <transition name="fade" mode="out-in" :key="page">
          <div v-if="filteredProducts.length > 0">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-[color:var(--color-primary)]">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Товар</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Категория</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата создания</th>
                  <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <transition-group name="fade" tag="tbody" class="bg-white divide-y divide-gray-200">
                <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-[color:var(--color-primary)] transition duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-12 w-12 flex-shrink-0 mr-4 overflow-hidden bg-[color:var(--color-primary)]">
                        <img 
                          :src="product.image_url || 'https://via.placeholder.com/40x40?text=Нет+изображения'" 
                          :alt="product.title" 
                          class="h-12 w-12 object-cover"
                        >
                      </div>
                      <div>
                        <div class="font-medium text-[color:var(--color-dark)]">{{ product.title }}</div>
                        <div class="text-[color:var(--color-light-text)] text-sm truncate max-w-xs">{{ product.description }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-[color:var(--color-light-text)] text-sm">Нет изображения</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-[color:var(--color-dark)]">{{ formatPrice(product.price) }} ₽</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-[color:var(--color-light-text)]">{{ formatDate(product.created_at) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      @click="showProductForm(product)" 
                      class="inline-flex items-center justify-center p-2 text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)] hover:bg-[color:var(--color-primary)] transition-colors duration-150 mr-1"
                      title="Редактировать"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      @click="confirmDeleteProduct(product)" 
                      class="inline-flex items-center justify-center p-2 text-[color:var(--color-light-text)] hover:text-red-600 hover:bg-[color:var(--color-primary)] transition-colors duration-150"
                      title="Удалить"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </transition-group>
            </table>
          </div>
        </transition>
        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex items-center justify-between px-6 py-4 bg-white border-t border-[color:var(--color-secondary)]">
          <div class="text-sm text-[color:var(--color-light-text)]">
            Страница {{ page }} из {{ totalPages }} (всего {{ total }} товаров)
          </div>
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
        </div>
      </div>
    </div>
  </div>

  <!-- Product Form Modal -->
  <teleport to="body">
    <div 
      v-if="showModal" 
      class="fixed inset-0 h-[100vh] w-[100vw] bg-black bg-opacity-40 overflow-hidden flex items-center justify-center z-[1000]"
    >
      <!-- Контейнер модального окна, центрированный -->
      <div class="bg-[color:var(--color-primary)] border border-[color:var(--color-secondary)] w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 m-4">
        <div class="p-8">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-xl font-medium text-[color:var(--color-dark)]">
              {{ isEditing ? 'Редактирование товара' : 'Добавление товара' }}
            </h3>
            <button 
              @click="closeModal" 
              class="inline-flex items-center justify-center p-2 text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)] hover:bg-[color:var(--color-secondary)] transition-colors duration-150 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="saveProduct">
            <div class="mb-6">
              <label class="velo-label">Название товара</label>
              <input 
                type="text" 
                id="title" 
                v-model="productForm.title" 
                class="velo-input w-full" 
                required
              >
            </div>
            
            <div class="mb-6">
              <label for="description" class="velo-label">Описание</label>
              <textarea 
                id="description" 
                v-model="productForm.description" 
                rows="4" 
                class="velo-input w-full" 
              required
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="velo-label">Цена (₽)</label>
                <input 
                  type="number" 
                  id="price" 
                  v-model.number="productForm.price" 
                  min="0" 
                  step="1" 
                  class="velo-input w-full" 
                  required
                >
              </div>
              
              <div>
                <label class="velo-label">Категория</label>
                <select 
                  id="category" 
                  v-model="productForm.category" 
                  class="velo-input w-full" 
                  required
                >
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                  <option value="new">+ Добавить новую категорию</option>
                </select>
              </div>
            </div>
            
            <div v-if="productForm.category === 'new'" class="mb-6">
              <label for="newCategory" class="velo-label">Новая категория</label>
              <input 
                type="text" 
                id="newCategory" 
                v-model="newCategory" 
                class="velo-input w-full" 
                required
              >
            </div>
            
            <div class="mb-8">
              <label for="image_url" class="velo-label">URL изображения</label>
              <input 
                id="image_url"
                type="url"
                v-model="productForm.image_url"
                class="velo-input w-full"
                placeholder="https://example.com/image.jpg"
                required
              >
              <div v-if="productForm.image_url" class="mt-4 overflow-hidden bg-[color:var(--color-primary)] h-48 w-full flex items-center justify-center">
                <img 
                  :src="productForm.image_url" 
                  alt="Предпросмотр"
                  class="w-full h-full object-cover"
                >
              </div>
              <div v-else class="mt-4 overflow-hidden bg-[color:var(--color-primary)] h-48 w-full flex items-center justify-center">
                <img 
                  src="https://via.placeholder.com/400x400?text=Нет+изображения" 
                  alt="Нет изображения"
                  class="w-full h-full object-cover"
                >
              </div>
              <div v-if="imagePreview || productForm.image_url" class="mt-4">
                <div v-if="imagePreview" class="mt-4 overflow-hidden bg-[color:var(--color-primary)] h-48 w-full flex items-center justify-center">
                  <img 
                    :src="imagePreview || productForm.image_url" 
                    alt="Предварительный просмотр" 
                    class="w-full h-full object-cover"
                  >
                </div>
              </div>
            </div>
            
            <div class="flex justify-end gap-4">
              <button 
                type="button" 
                @click="closeModal" 
                class="velo-btn velo-btn-secondary mr-2"
              >
                Отмена
              </button>
              <button 
                type="submit" 
                :disabled="formSubmitting" 
                class="velo-btn velo-btn-primary flex items-center"
              >
                <span v-if="formSubmitting" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Сохранение...
                </span>
                <span v-else>Сохранить</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </teleport>
  
  <!-- Delete Confirmation Modal -->
  <teleport to="body">
    <div 
      v-if="showDeleteModal" 
      class="fixed inset-0 h-[100vh] w-[100vw] bg-black bg-opacity-40 overflow-hidden flex items-center justify-center z-[1000]"
    >
      <!-- Контейнер модального окна, центрированный -->
      <div class="bg-[color:var(--color-primary)] border border-[color:var(--color-secondary)] w-full max-w-md p-8 z-10 m-4">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center h-16 w-16 bg-[color:var(--color-secondary)] text-[color:var(--color-accent)] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 class="text-xl font-medium text-[color:var(--color-dark)] mb-4">Подтверждение удаления</h3>
          <p class="text-[color:var(--color-light-text)] mb-6">Вы уверены, что хотите удалить товар "{{ productToDelete?.title }}"? Это действие нельзя отменить.</p>
        </div>
        
        <div class="flex justify-center gap-4">
          <button 
            @click="showDeleteModal = false" 
            class="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 transition duration-150 text-sm font-medium"
          >
            Отмена
          </button>
          <button 
            @click="deleteProduct" 
            :disabled="deleteSubmitting"
            class="py-2 px-4 bg-red-600 hover:bg-red-700 text-white transition duration-150 text-sm font-medium flex items-center"
          >
            <span v-if="deleteSubmitting" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Удаление...
            </span>
            <span v-else>Удалить</span>
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';

export default {
  name: 'ProductsTab',
  setup() {
    const store = useStore();
    // Пагинация
    const page = computed(() => store.getters['products/page']);
    const limit = computed(() => store.getters['products/limit']);
    const total = computed(() => store.getters['products/total']);
    const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)));
    // Показывать максимум 5 страниц в пагинации
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
    };

    const toast = useToast();
    
    // State for product list and filtering
    const searchQuery = ref('');
    const selectedCategory = ref('');
    const searchTimeout = ref(null);
    
    // State for modals
    const showModal = ref(false);
    const isEditing = ref(false);
    const showDeleteModal = ref(false);
    const productToDelete = ref(null);
    const formSubmitting = ref(false);
    const deleteSubmitting = ref(false);
    
    // Product form state
    const productForm = ref({
      id: null,
      title: '',
      description: '',
      price: 0,
      category: '',
      image: null,
      image_url: ''
    });
    const newCategory = ref('');
    const imagePreview = ref(null);
    
    // Computed properties
    const products = computed(() => store.getters['products/allProducts']);
    const categories = computed(() => store.getters['products/categories']);
    const loading = computed(() => store.getters.isLoading);
    
    const filteredProducts = computed(() => {
      let result = [...products.value];
      
      // Filter by category
      if (selectedCategory.value) {
        result = result.filter(product => product.category === selectedCategory.value);
      }
      
      // Filter by search term
      if (searchQuery.value) {
        const searchLower = searchQuery.value.toLowerCase();
        result = result.filter(product => 
          product.title.toLowerCase().includes(searchLower) || 
          product.description.toLowerCase().includes(searchLower)
        );
      }
      
      return result;
    });
    
    // Methods for filtering
    const debounceSearch = () => {
      clearTimeout(searchTimeout.value);
      searchTimeout.value = setTimeout(() => {
        // No API call needed as we filter locally
      }, 300);
    };
    
    const applyFilters = () => {
      // No API call needed as we filter locally
    };
    
    const resetFilters = () => {
      searchQuery.value = '';
      selectedCategory.value = '';
    };
    
    // Methods for product form
    const resetForm = () => {
      productForm.value = {
        id: null,
        title: '',
        description: '',
        price: 0,
        category: '',

        image_url: ''
      };
      newCategory.value = '';
    
    };
    
    const showProductForm = (product) => {
      resetForm();
      
      if (product) {
        // Edit existing product
        productForm.value = {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,

          image_url: product.image_url
        };
        isEditing.value = true;
      } else {
        // Add new product
        isEditing.value = false;
      }
      
      showModal.value = true;
    };
    
    const closeModal = () => {
      showModal.value = false;
      resetForm();
    };
    
    const saveProduct = async () => {
      // Check if we need to use the new category
      if (productForm.value.category === 'new' && newCategory.value) {
        productForm.value.category = newCategory.value;
      }
      
      formSubmitting.value = true;
      
      try {
        if (isEditing.value) {
          // Update existing product
          const result = await store.dispatch('products/updateProduct', {
            productId: productForm.value.id,
            productData: productForm.value
          });
          
          if (result.success) {
            // Success notification is handled by the store
            closeModal();
          }
        } else {
          // Create new product
          const result = await store.dispatch('products/createProduct', productForm.value);
          
          if (result.success) {
            // Success notification is handled by the store
            closeModal();
          }
        }
      } catch (error) {
        console.error('Error saving product:', error);
        // Error notification is handled by the store
      } finally {
        formSubmitting.value = false;
      }
    };
    
    // Methods for product deletion
    const confirmDeleteProduct = (product) => {
      productToDelete.value = product;
      showDeleteModal.value = true;
    };
    
    const deleteProduct = async () => {
      if (!productToDelete.value) return;
      
      deleteSubmitting.value = true;
      
      try {
        const result = await store.dispatch('products/deleteProduct', productToDelete.value.id);
        
        if (result.success) {
          // Success notification is handled by the store
          showDeleteModal.value = false;
          productToDelete.value = null;
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        // Error notification is handled by the store
      } finally {
        deleteSubmitting.value = false;
      }
    };
    
    // Format helpers
    const formatDate = (dateString) => {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    };
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('ru-RU').format(price);
    };
    
    // Lifecycle hooks
    onMounted(async () => {
      // Load products and categories
      await Promise.all([
        store.dispatch('products/fetchProducts'),
        store.dispatch('products/fetchCategories')
      ]);
    });
    
    return {
      page,
      limit,
      total,
      totalPages,
      visiblePages,
      changePage,
      searchQuery,
      selectedCategory,
      showModal,
      isEditing,
      showDeleteModal,
      productToDelete,
      productForm,
      newCategory,
      formSubmitting,
      deleteSubmitting,
      products,
      filteredProducts,
      categories,
      loading,
      debounceSearch,
      applyFilters,
      resetFilters,
      showProductForm,
      closeModal,

      saveProduct,
      confirmDeleteProduct,
      deleteProduct,
      formatDate,
      formatPrice
    };
  }
};
</script>
