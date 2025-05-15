<template>
  <div>
    <!-- Hero Section -->
    <section class="py-16 md:py-24 bg-[color:var(--color-bg)]">
      <div class="velo-container">
        <div class="flex flex-col lg:flex-row items-center space-y-12 lg:space-y-0 lg:space-x-16">
          <div class="lg:w-1/2">
            <h1 class="text-4xl md:text-5xl font-light text-[color:var(--color-dark)] mb-6 leading-tight">
              Стильный декор для вашего дома
            </h1>
            <p class="text-[color:var(--color-light-text)] mb-10 leading-relaxed">
              Откройте для себя уникальные предметы декора, которые преобразят ваше пространство и создадут атмосферу уюта и стиля.
            </p>
            <router-link to="/shop" class="velo-btn velo-btn-primary inline-block">
              Перейти в каталог
            </router-link>
          </div>
          <div class="lg:w-1/2">
            <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" alt="Стильный декор" class="w-full">
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-20 border-t border-[color:var(--color-secondary)]">
      <div class="velo-container">
        <h2 class="text-3xl font-light text-[color:var(--color-dark)] mb-16 text-center">
          Категории
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div 
            v-for="category in ['Освещение', 'Мебель', 'Текстиль']" 
            :key="category" 
            class="group transition-all duration-300">
            <div class="h-64 overflow-hidden mb-6">
              <img 
                :src="getCategoryImage(category)" 
                alt="Категория" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              >
            </div>
            <div class="px-2">
              <h3 class="text-xl font-light text-[color:var(--color-dark)] mb-3">{{ category }}</h3>
              <router-link 
                :to="{ path: '/shop', query: { category: category }}" 
                class="text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)] flex items-center"
              >
                Смотреть товары
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-20 bg-[color:var(--color-bg-secondary)]">
      <div class="velo-container">
        <h2 class="text-3xl font-light text-[color:var(--color-dark)] mb-16 text-center">
          Популярные товары
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
          <template v-if="isLoading">
            <div class="col-span-4 flex justify-center items-center py-16">
              <div class="animate-spin h-10 w-10 border-t-2 border-b-2 border-[color:var(--color-accent)]"></div>
            </div>
          </template>
          <template v-else-if="error">
            <div class="col-span-4 text-center text-[color:var(--color-accent)] py-8">
              {{ error }}
            </div>
          </template>
          <template v-else>
            <div 
              v-for="product in popularProducts" 
              :key="product.id" 
              class="group flex flex-col transition-transform duration-300 hover:translate-y-[-8px]"
            >
              <router-link :to="`/product/${product.id}`">
                <div class="h-52 overflow-hidden mb-6">
                  <img 
                    :src="product.image_url || 'https://via.placeholder.com/400x400?text=Нет+изображения'" 
                    :alt="product.title" 
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  >
                </div>
                <h3 class="text-lg font-light text-[color:var(--color-dark)] mb-2">{{ product.title }}</h3>
                <p class="text-[color:var(--color-light-text)] mb-4 text-sm line-clamp-2">
                  {{ product.description }}
                </p>
                <div class="flex justify-between items-center mt-auto">
                  <span class="text-[color:var(--color-accent)]">{{ formatPrice(product.price) }} ₽</span>
                  <span class="velo-btn-sm velo-btn-secondary py-1 px-2">Подробнее</span>
                </div>
              </router-link>
            </div>
          </template>
        </div>
        <div class="text-center mt-16">
          <router-link to="/shop" class="velo-btn velo-btn-primary">
            Смотреть все товары
          </router-link>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-20 border-t border-[color:var(--color-secondary)]">
      <div class="velo-container">
        <h2 class="text-3xl font-light text-[color:var(--color-dark)] mb-16 text-center">
          Почему выбирают нас
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div class="flex flex-col items-center text-center">
            <div class="border border-[color:var(--color-secondary)] p-6 mb-6 inline-block rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[color:var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 class="text-xl font-light text-[color:var(--color-dark)] mb-4">Качество</h3>
            <p class="text-[color:var(--color-light-text)] leading-relaxed">
              Мы выбираем только лучшие материалы и работаем с проверенными поставщиками, чтобы гарантировать высокое качество каждого товара.
            </p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="border border-[color:var(--color-secondary)] p-6 mb-6 inline-block rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[color:var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-light text-[color:var(--color-dark)] mb-4">Скорость доставки</h3>
            <p class="text-[color:var(--color-light-text)] leading-relaxed">
              Мы ценим ваше время и стремимся доставить заказ в кратчайшие сроки, чтобы вы могли наслаждаться покупками без задержек.
            </p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="border border-[color:var(--color-secondary)] p-6 mb-6 inline-block rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[color:var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-light text-[color:var(--color-dark)] mb-4">Гарантия</h3>
            <p class="text-[color:var(--color-light-text)] leading-relaxed">
              Мы уверены в качестве нашей продукции и предоставляем гарантию на все товары, чтобы вы чувствовали себя защищенными при покупке.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'HomeView',
  setup() {
    const store = useStore();
    const isLoading = computed(() => store.getters.isLoading);
    const error = computed(() => store.getters.error);
    const allProducts = computed(() => store.getters['products/allProducts']);
    // Pick top 4 by price as 'popular', or use another logic if needed
    const popularProducts = computed(() => {
      return [...allProducts.value]
        .sort((a, b) => b.price - a.price)
        .slice(0, 4);
    });

    const formatPrice = (price) => {
      return new Intl.NumberFormat('ru-RU').format(price);
    };

    onMounted(() => {
      if (!allProducts.value.length) {
        store.dispatch('products/fetchProducts');
      }
    });

    // For categories block
    const getCategoryImage = (category) => {
      const images = {
        'Освещение': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'Мебель': 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'Текстиль': 'https://images.unsplash.com/photo-1577979749830-f1d742b96791?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      };
      return images[category] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
    };

    return {
      isLoading,
      error,
      popularProducts,
      formatPrice,
      getCategoryImage
    };
  }
};
</script>
