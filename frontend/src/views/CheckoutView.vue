<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
    <h1 class="text-3xl font-light text-[color:var(--color-dark)] mb-16 text-center">Оформление заказа</h1>
    
    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="animate-spin h-12 w-12 border-3 border-[color:var(--color-accent)] border-t-transparent "></div>
    </div>
    
    <div v-else-if="!isAuthenticated" class="text-center py-24 bg-[color:var(--color-primary)]   max-w-lg mx-auto">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-[color:var(--color-secondary)] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <h2 class="text-2xl font-light text-[color:var(--color-dark)] mb-4">Требуется авторизация</h2>
      <p class="text-[color:var(--color-light-text)] mb-8">Для оформления заказа необходимо войти в систему</p>
      <router-link to="/login?redirect=/checkout" class="py-3 px-6 bg-[color:var(--color-accent)] hover:bg-[color:var(--color-dark)] text-white  transition duration-150 text-sm font-medium inline-block">
        Войти в аккаунт
      </router-link>
    </div>
    
    <div v-else-if="cartItems.length === 0" class="text-center py-24 bg-[color:var(--color-primary)]   max-w-lg mx-auto">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-[color:var(--color-secondary)] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h2 class="text-2xl font-light text-[color:var(--color-dark)] mb-4">Ваша корзина пуста</h2>
      <p class="text-[color:var(--color-light-text)] mb-8">Добавьте товары в корзину, чтобы оформить заказ</p>
      <router-link to="/shop" class="py-3 px-6 bg-[color:var(--color-accent)] hover:bg-[color:var(--color-dark)] text-white  transition duration-150 text-sm font-medium inline-block">
        Перейти в каталог
      </router-link>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="bg-[color:var(--color-primary)]   p-8 mb-8">
          <h2 class="text-xl font-medium text-[color:var(--color-dark)] mb-6">Информация о заказе</h2>
          
          <div class="mb-4">
            <p class="text-[color:var(--color-light-text)] mb-1">Вы оформляете заказ как:</p>
            <p class="font-medium text-[color:var(--color-dark)]">{{ user.email }}</p>
          </div>
        </div>
        
        <div class="bg-[color:var(--color-primary)]   overflow-hidden mb-8">
          <div class="p-8 border-b border-[color:var(--color-secondary)]">
            <h2 class="text-xl font-medium text-[color:var(--color-dark)]">Содержимое заказа</h2>
          </div>
          
          <div class="divide-y divide-[color:var(--color-secondary)]">
            <div 
              v-for="item in cartItems" 
              :key="item.productId" 
              class="p-6 flex justify-between items-center"
            >
              <div class="flex items-center">
                <div class="w-20 h-20  overflow-hidden flex-shrink-0 mr-6 bg-[color:var(--color-secondary)]">
                  <img 
                    :src="item.image_url || 'https://via.placeholder.com/100x100?text=Нет+изображения'" 
                    :alt="item.title" 
                    class="w-full h-full object-cover"
                  >
                </div>
                <div>
                  <h3 class="font-medium text-[color:var(--color-dark)] mb-1">{{ item.title }}</h3>
                  <p class="text-sm text-[color:var(--color-light-text)]">Количество: {{ item.quantity }}</p>
                </div>
              </div>
              <div class="font-medium text-[color:var(--color-dark)]">
                {{ formatPrice(item.price * item.quantity) }} ₽
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-between items-center">
          <router-link to="/cart" class="flex items-center text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)] transition duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Вернуться в корзину
          </router-link>
        </div>
      </div>
      
      <div class="lg:col-span-1">
        <div class="bg-[color:var(--color-primary)]   p-8 sticky top-4">
          <h2 class="text-xl font-medium text-[color:var(--color-dark)] mb-8">Итого по заказу</h2>
          
          <div class="space-y-4 mb-8">
            <div class="flex justify-between">
              <span class="text-[color:var(--color-light-text)]">Сумма</span>
              <span class="font-medium">{{ formatPrice(cartTotal) }} ₽</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[color:var(--color-light-text)]">Товаров</span>
              <span class="font-medium">{{ cartItemsCount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[color:var(--color-light-text)]">Доставка</span>
              <span class="font-medium">Бесплатно</span>
            </div>
            <div class="border-t border-[color:var(--color-secondary)] pt-4 flex justify-between mt-6">
              <span class="font-medium text-[color:var(--color-dark)]">Итого к оплате</span>
              <span class="font-bold text-lg">{{ formatPrice(cartTotal) }} ₽</span>
            </div>
          </div>
          
          <button 
            class="velo-btn velo-btn-primary w-full"
            @click="placeOrder"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Оформление...
            </span>
            <span v-else >
             
              Оформить заказ!
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

export default {
  name: 'CheckoutView',
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();
    
    // Computed properties
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    const user = computed(() => store.getters['auth/currentUser'] || {});
    const cartItems = computed(() => store.getters['cart/cartItems']);
    const cartTotal = computed(() => store.getters['cart/cartTotal']);
    const cartItemsCount = computed(() => store.getters['cart/cartItemsCount']);
    const loading = computed(() => store.getters.isLoading);
    
    // Methods
    const fetchCart = () => {
      store.dispatch('cart/fetchCart');
    };
    
    const placeOrder = async () => {
      if (!isAuthenticated.value) {
        toast.error('Для оформления заказа необходимо войти в систему');
        router.push('/login?redirect=/checkout');
        return;
      }
      
      if (cartItems.value.length === 0) {
        toast.error('Корзина пуста');
        return;
      }
      
      const result = await store.dispatch('orders/createOrder');
      
      if (result.success) {
        // Order created successfully, router redirect handled in the action
      }
    };
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('ru-RU').format(price);
    };
    
    // Lifecycle hooks
    onMounted(() => {
      if (!isAuthenticated.value) {
        toast.info('Для оформления заказа необходимо войти в систему');
        router.push('/login?redirect=/checkout');
        return;
      }
      
      fetchCart();
    });
    
    return {
      isAuthenticated,
      user,
      cartItems,
      cartTotal,
      cartItemsCount,
      loading,
      placeOrder,
      formatPrice
    };
  }
};
</script>
