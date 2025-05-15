<template>
  <div class="velo-container py-12 md:py-16">
    <h1 class="mb-12">Корзина</h1>
    
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin h-10 w-10 border-2 border-[color:var(--color-accent)] border-t-transparent rounded-full"></div>
    </div>
    
    <div v-else-if="cartItems.length === 0" class="text-center py-20 border border-[color:var(--color-secondary)]">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-[color:var(--color-accent)] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <h2 class="text-2xl font-light text-[color:var(--color-dark)] mb-4">Ваша корзина пуста</h2>
      <p class="text-[color:var(--color-light-text)] mb-10">Добавьте товары в корзину, чтобы продолжить покупки</p>
      <router-link to="/shop" class="velo-btn velo-btn-primary">
        Перейти в каталог
      </router-link>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div class="lg:col-span-8">
        <!-- Cart Header -->
        <div class="border-b border-[color:var(--color-secondary)] pb-4 mb-8 hidden md:block">
          <div class="grid grid-cols-12 gap-4 text-xs uppercase tracking-wider text-[color:var(--color-light-text)]">
            <div class="col-span-6">Товар</div>
            <div class="col-span-2 text-center">Цена</div>
            <div class="col-span-2 text-center">Кол-во</div>
            <div class="col-span-2 text-right">Итого</div>
          </div>
        </div>
        
        <!-- Cart Items -->
        <div class="space-y-8">
          <div 
            v-for="item in cartItems" 
            :key="item.productId" 
            class="border-b border-[color:var(--color-secondary)] pb-8"
          >
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <!-- Product Info -->
              <div class="md:col-span-6 flex items-center">
                <div class="w-20 h-20 overflow-hidden mr-4">
                  <img 
                    :src="item.image_url || 'https://via.placeholder.com/100x100?text=Velo'" 
                    :alt="item.title" 
                    class="w-full h-full object-cover"
                  >
                </div>
                <div>
                  <h3 class="font-light text-[color:var(--color-dark)] mb-1">{{ item.title }}</h3>
                  <button 
                    class="text-sm text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)]"
                    @click="removeFromCart(item.productId)"
                  >
                    Удалить
                  </button>
                </div>
              </div>
              
              <!-- Price -->
              <div class="md:col-span-2 flex justify-between md:justify-center items-center">
                <span class="md:hidden text-xs text-[color:var(--color-light-text)]">Цена:</span>
                <span class="text-[color:var(--color-dark)]">{{ formatPrice(item.price) }} ₽</span>
              </div>
              
              <!-- Quantity -->
              <div class="md:col-span-2 flex justify-between md:justify-center items-center">
                <span class="md:hidden text-xs text-[color:var(--color-light-text)]">Количество:</span>
                <div class="flex items-center border border-[color:var(--color-secondary)]">
                  <button 
                    class="px-3 py-1 text-[color:var(--color-dark)] hover:text-[color:var(--color-accent)]"
                    @click="updateQuantity(item.productId, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                  >
                    &minus;
                  </button>
                  
                  <span class="w-8 text-center text-[color:var(--color-dark)]">{{ item.quantity }}</span>
                  
                  <button 
                    class="px-3 py-1 text-[color:var(--color-dark)] hover:text-[color:var(--color-accent)]"
                    @click="updateQuantity(item.productId, item.quantity + 1)"
                  >
                    &#43;
                  </button>
                </div>
              </div>
              
              <!-- Subtotal -->
              <div class="md:col-span-2 flex justify-between md:justify-end items-center">
                <span class="md:hidden text-xs text-[color:var(--color-light-text)]">Итого:</span>
                <span class="text-[color:var(--color-accent)]">{{ formatPrice(item.price * item.quantity) }} ₽</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Continue Shopping -->
        <div class="mt-10">
          <router-link to="/shop" class="flex items-center text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Продолжить покупки
          </router-link>
        </div>
      </div>
      
      <!-- Order Summary -->
      <div class="lg:col-span-4">
        <div class="border border-[color:var(--color-secondary)] p-8 sticky top-28">
          <h2 class="text-2xl font-light text-[color:var(--color-dark)] mb-8">Итого по заказу</h2>
          
          <div class="space-y-5 mb-8">
            <div class="flex justify-between">
              <span class="text-[color:var(--color-light-text)]">Сумма</span>
              <span>{{ formatPrice(cartTotal) }} ₽</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[color:var(--color-light-text)]">Товаров</span>
              <span>{{ cartItemsCount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[color:var(--color-light-text)]">Доставка</span>
              <span>Бесплатно</span>
            </div>
            <div class="border-t border-[color:var(--color-secondary)] pt-5 flex justify-between">
              <span class="text-[color:var(--color-dark)]">Итого к оплате</span>
              <span class="text-[color:var(--color-accent)] text-xl">{{ formatPrice(cartTotal) }} ₽</span>
            </div>
          </div>
          
          <button 
            class="velo-btn velo-btn-primary w-full"
            @click="proceedToCheckout"
          >
            Оформить заказ
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
  name: 'CartView',
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();
    
    // Computed properties
    const cartItems = computed(() => store.getters['cart/cartItems']);
    const cartTotal = computed(() => store.getters['cart/cartTotal']);
    const cartItemsCount = computed(() => store.getters['cart/cartItemsCount']);
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    const loading = computed(() => store.getters.isLoading);
    
    // Methods
    const fetchCart = () => {
      store.dispatch('cart/fetchCart');
    };
    
    const updateQuantity = (productId, quantity) => {
      if (quantity < 1) {
        removeFromCart(productId);
        return;
      }
      
      store.dispatch('cart/updateCartItem', { productId, quantity });
    };
    
    const removeFromCart = (productId) => {
      store.dispatch('cart/removeFromCart', productId);
    };
    
    const proceedToCheckout = () => {
      if (!isAuthenticated.value) {
        toast.info('Для оформления заказа необходимо войти в систему');
        router.push('/login?redirect=/checkout');
      } else {
        router.push('/checkout');
      }
    };
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('ru-RU').format(price);
    };
    
    // Lifecycle hooks
    onMounted(() => {
      fetchCart();
    });
    
    return {
      cartItems,
      cartTotal,
      cartItemsCount,
      loading,
      updateQuantity,
      removeFromCart,
      proceedToCheckout,
      formatPrice
    };
  }
};
</script>
