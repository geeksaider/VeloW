<template>
  <div class="velo-container py-16 md:py-24">
    <h1 class="text-3xl font-light text-[color:var(--color-dark)] mb-10 text-center">Новинки</h1>
    <div class="bg-white border border-[color:var(--color-secondary)] p-6 md:p-8 mb-12 max-w-3xl mx-auto text-center">
      <p class="text-xl md:text-2xl font-light mb-2">Velo — это не просто магазин, а команда энтузиастов, влюбленных в современный минимализм и эстетику уюта.</p>
      <p class="text-md text-[color:var(--color-light-text)]">Мы постоянно обновляем ассортимент, чтобы радовать вас свежими идеями и новыми товарами для стильного и гармоничного дома. Следите за нашими новинками — здесь всегда что-то особенное!</p>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="animate-spin h-12 w-12 border-t-2 rounded-full border-b-2 border-[color:var(--color-accent)]"></div>
    </div>
    <div v-else-if="products.length === 0" class="text-center py-32">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-[color:var(--color-light-text)] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <p class="text-xl text-[color:var(--color-light-text)] mb-6">Новинок пока нет</p>
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
          <div  aria-label="Новинка" class="z-10 absolute top-2 right-2 px-3 py-1  text-xs font-bold bg-[color:var(--color-accent)] text-white">
            NEW
          </div>
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div class="flex gap-3">
              <router-link 
                :to="`/product/${product.id}`" 
                class="bg-white text-black p-3 shadow-md hover:bg-[color:var(--color-accent)] hover:text-white transition duration-150"
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
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const loading = computed(() => store.getters.isLoading);
const allProducts = computed(() => store.getters['products/allProducts']);

onMounted(() => {
  if (!allProducts.value.length) {
    store.dispatch('products/fetchProducts');
  }
});

const products = computed(() => {
  return [...allProducts.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);
});

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price);
}

function addToCart(product) {
  store.dispatch('cart/addToCart', { product, quantity: 1 });
}
</script>



