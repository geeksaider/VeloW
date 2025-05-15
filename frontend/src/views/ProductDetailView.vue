<template>
  <div class="velo-container py-12 md:py-16">
    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="animate-spin h-12 w-12 border-t-2 border-b-2 border-[color:var(--color-accent)]"></div>
    </div>
    
    <div v-else-if="!product" class="text-center py-32">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-[color:var(--color-light-text)] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-3xl font-light text-[color:var(--color-dark)] mb-4">Товар не найден</h2>
      <p class="text-[color:var(--color-light-text)] mb-8">Запрашиваемый товар не существует или был удален.</p>
      <router-link to="/shop" class="velo-btn velo-btn-primary inline-block">
        Вернуться в каталог
      </router-link>
    </div>
    
    <div v-else>
      <!-- Breadcrumbs -->
      <div class="flex items-center text-sm text-[color:var(--color-light-text)] mb-12">
        <router-link to="/" class="hover:text-[color:var(--color-accent)] transition duration-150">Главная</router-link>
        <span class="mx-2">/</span>
        <router-link to="/shop" class="hover:text-[color:var(--color-accent)] transition duration-150">Каталог</router-link>
        <span class="mx-2">/</span>
        <span class="text-[color:var(--color-accent)]">{{ product.title }}</span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
        <!-- Product Image -->
        <div class="md:col-span-6 lg:col-span-7">
          <div class="overflow-hidden bg-[color:var(--color-primary)] border border-[color:var(--color-secondary)]">
            <img 
              :src="product.image_url || 'https://via.placeholder.com/800x800?text=Velo'" 
              :alt="product.title" 
              class="w-full h-auto object-cover"
            >
          </div>
        </div>
        
        <!-- Product Info -->
        <div class="md:col-span-6 lg:col-span-5">
          <h1 class="text-3xl font-light text-[color:var(--color-dark)] mb-4">{{ product.title }}</h1>
          
          <div class="text-2xl font-medium text-[color:var(--color-accent)] mb-8">
            {{ formatPrice(product.price) }} ₽
          </div>
          
          <div class="mb-8 border-t border-[color:var(--color-secondary)] pt-8">
            <p class="text-[color:var(--color-light-text)] leading-relaxed">{{ product.description }}</p>
          </div>
          
          <div class="mb-8">
            <span class="text-sm font-medium text-[color:var(--color-dark)]">Категория:</span>
            <span class="text-[color:var(--color-light-text)] uppercase tracking-wider text-xs ml-2 border-b border-[color:var(--color-secondary)] pb-0.5">
              {{ product.category }}
            </span>
          </div>
          
          <div class="mb-10">
            <label for="quantity" class="velo-label mb-2">Количество</label>
            <div class="flex">
              <button 
                class="border border-[color:var(--color-secondary)] text-[color:var(--color-dark)] px-4 py-2 hover:bg-[color:var(--color-primary)] transition duration-150" 
                @click="quantity > 1 && quantity--"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 12H4" />
                </svg>
              </button>
              <input 
                id="quantity" 
                type="number" 
                v-model.number="quantity" 
                min="1" 
                class="block w-16 py-2 px-3 border-y border-[color:var(--color-secondary)] focus:ring-[color:var(--color-accent)] focus:border-[color:var(--color-accent)] text-center text-[color:var(--color-dark)]"
              >
              <button 
                class="border border-[color:var(--color-secondary)] text-[color:var(--color-dark)] px-4 py-2 hover:bg-[color:var(--color-primary)] transition duration-150" 
                @click="quantity++"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              class="velo-btn velo-btn-primary w-full flex items-center justify-center"
              @click="addToCart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Добавить в корзину
            </button>
            <router-link to="/shop" class="py-3 px-6 text-[color:var(--color-accent)] hover:bg-[color:var(--color-accent)] hover:text-white border border-[color:var(--color-accent)] bg-transparent  uppercase transition-all duration-300 w-full sm:flex-1 text-center text-sm font-medium flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Продолжить покупки
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Related Products -->
      <div class="mt-24">
        <h2 class="text-2xl font-light text-[color:var(--color-dark)] mb-12 text-center">Похожие товары</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          <div 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id" 
            class="group"
          >
            <div class="relative mb-4 overflow-hidden bg-[color:var(--color-primary)] border border-[color:var(--color-secondary)]" style="aspect-ratio: 1/1;">
              <img 
                :src="relatedProduct.image_url || 'https://via.placeholder.com/300x300?text=Нет+изображения'" 
                :alt="relatedProduct.title" 
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              >
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <router-link 
                  :to="`/product/${relatedProduct.id}`" 
                  class="bg-white text-[color:var(--color-accent)] p-3 shadow-md hover:bg-[color:var(--color-accent)] hover:text-white transition duration-150"
                  aria-label="Подробнее"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </router-link>
              </div>
            </div>
            
            <router-link :to="`/product/${relatedProduct.id}`" class="block">
              <h3 class="font-medium text-[color:var(--color-dark)] mb-1 line-clamp-1">{{ relatedProduct.title }}</h3>
              <p class="text-[color:var(--color-light-text)] text-sm">{{ formatPrice(relatedProduct.price) }} ₽</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

export default {
  name: 'ProductDetailView',
  setup() {
    const store = useStore();
    const route = useRoute();
    const toast = useToast();
    
    // State
    const quantity = ref(1);
    const productId = computed(() => parseInt(route.params.id));
    
    // Computed properties
    const product = computed(() => store.getters['products/currentProduct']);
    const allProducts = computed(() => store.getters['products/allProducts']);
    const loading = computed(() => store.getters.isLoading);
    
    const relatedProducts = computed(() => {
      if (!product.value) return [];
      
      // Filter products in the same category, excluding current product
      return allProducts.value
        .filter(p => p.category === product.value.category && p.id !== product.value.id)
        .slice(0, 4); // Limit to 4 products
    });
    
    // Methods
    const fetchProduct = async () => {
      await store.dispatch('products/fetchProduct', productId.value);
      
      // If we don't have enough related products (same category), fetch all products
      if (!allProducts.value.length) {
        await store.dispatch('products/fetchProducts');
      }
    };
    
    const addToCart = () => {
      if (product.value) {
        store.dispatch('cart/addToCart', { 
          product: product.value, 
          quantity: quantity.value 
        });
        
        quantity.value = 1; // Reset quantity after adding
      }
    };
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('ru-RU').format(price);
    };
    
    // Lifecycle hooks
    onMounted(() => {
      fetchProduct();
    });
    
    return {
      product,
      relatedProducts,
      loading,
      quantity,
      addToCart,
      formatPrice
    };
  }
};
</script>

<style scoped>
/* Hide default number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
