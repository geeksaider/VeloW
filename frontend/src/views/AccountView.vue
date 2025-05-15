<template>
  <div class="velo-container py-12 md:py-16">
    <h1 class="text-3xl font-light text-[color:var(--color-dark)] mb-10">Личный кабинет</h1>
    
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[color:var(--color-accent)]"></div>
    </div>
    
    <div v-else-if="!isAuthenticated" class="text-center py-16 border border-[color:var(--color-secondary)]">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-[color:var(--color-light-text)] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <h2 class="text-2xl font-light text-[color:var(--color-dark)] mb-4">Требуется авторизация</h2>
      <p class="text-[color:var(--color-light-text)] mb-8">Для доступа к личному кабинету необходимо войти в систему</p>
      <router-link to="/login?redirect=/account" class="velo-btn velo-btn-primary">
        Войти в аккаунт
      </router-link>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-12 gap-10">
      <!-- Sidebar -->
      <div class="md:col-span-3">
        <div class="border border-[color:var(--color-secondary)]">
          <div class="p-6 border-b border-[color:var(--color-secondary)]">
            <h2 class="font-light text-[color:var(--color-dark)] break-all">{{ user.email }}</h2>
            <p class="text-sm text-[color:var(--color-light-text)] mt-1">Дата регистрации: {{ formatDate(user.created_at) }}</p>
          </div>
          
          <nav class="p-4">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'w-full text-left px-4 py-3 transition-colors mb-2',
                activeTab === tab.id 
                  ? 'bg-[color:var(--color-secondary-light)] text-[color:var(--color-dark)]' 
                  : 'text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)]'
              ]"
            >
              {{ tab.title }}
            </button>
            
            <button 
              @click="logout"
              class="w-full text-left px-4 py-3 transition-colors text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)]"
            >
              Выйти
            </button>
          </nav>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="md:col-span-9">
        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="border border-[color:var(--color-secondary)] p-8">
          <h2 class="text-2xl font-light text-[color:var(--color-dark)] mb-8">Ваш профиль</h2>
          
          <div class="mb-10">
            <h3 class="text-lg font-light text-[color:var(--color-dark)] mb-4">Информация</h3>
            <p class="mb-2"><span class="text-[color:var(--color-light-text)]">Email:</span> <span class="break-all">{{ user.email }}</span></p>
            <p><span class="text-[color:var(--color-light-text)]">Аккаунт создан:</span> {{ formatDate(user.created_at) }}</p>
          </div>
          
          <div>
            <h3 class="text-lg font-light text-[color:var(--color-dark)] mb-6">Изменить пароль</h3>
            <form @submit.prevent="updatePassword" class="space-y-6">
              <div>
                <label for="currentPassword" class="velo-label">Текущий пароль</label>
                <input 
                  id="currentPassword" 
                  type="password" 
                  v-model="passwordForm.currentPassword" 
                  class="velo-input w-full" 
                  required
                >
              </div>
              
              <div>
                <label for="newPassword" class="velo-label">Новый пароль</label>
                <input 
                  id="newPassword" 
                  type="password" 
                  v-model="passwordForm.newPassword" 
                  class="velo-input w-full" 
                  required
                  minlength="6"
                >
                <p class="text-xs text-[color:var(--color-light-text)] mt-2">Минимум 6 символов</p>
              </div>
              
              <div>
                <label for="confirmPassword" class="velo-label">Подтверждение пароля</label>
                <input 
                  id="confirmPassword" 
                  type="password" 
                  v-model="passwordForm.confirmPassword" 
                  class="velo-input w-full" 
                  required
                  minlength="6"
                >
                <p v-if="passwordError" class="text-xs text-red-500 mt-2">
                  {{ passwordError }}
                </p>
              </div>
              
              <div class="pt-4">
                <button 
                  type="submit" 
                  class="velo-btn velo-btn-primary"
                  :disabled="passwordUpdating || !isPasswordFormValid"
                >
                  <span v-if="passwordUpdating" class="flex items-center justify-center">
                    <svg class="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Обновление...
                  </span>
                  <span v-else>Обновить пароль</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Orders Tab -->
        <div v-if="activeTab === 'orders'" class="border border-[color:var(--color-secondary)]">
          <div class="p-8 border-b border-[color:var(--color-secondary)]">
            <h2 class="text-2xl font-light text-[color:var(--color-dark)]">История заказов</h2>
          </div>
          
          <div v-if="orders.length === 0" class="py-10 text-center">
            <p class="text-[color:var(--color-light-text)] mb-6">У вас пока нет заказов</p>
            <router-link to="/shop" class="velo-btn velo-btn-primary inline-block">
              Перейти в каталог
            </router-link>
          </div>
          <div v-else class="divide-y divide-[color:var(--color-secondary)]">
            <div 
              v-for="order in orders" 
              :key="order.id" 
              class="p-8 hover:bg-[color:var(--color-primary)] transition-colors"
            >
              <div class="flex flex-wrap justify-between items-start mb-6">
                <div>
                  <h3 class="font-light text-[color:var(--color-dark)]">
                    Заказ #{{ order.id }}
                  </h3>
                  <p class="text-sm text-[color:var(--color-light-text)] mt-1">
                    {{ formatDate(order.created_at) }}
                  </p>
                </div>
                <div class="text-[color:var(--color-accent)]">
                  {{ formatPrice(getOrderTotal(order)) }} ₽
                </div>
              </div>
              
              <div class="space-y-5">
                <div 
                  v-for="item in order.items" 
                  :key="item.id" 
                  class="flex items-center"
                >
                  <div class="w-16 h-16 overflow-hidden flex-shrink-0">
                    <img 
                      :src="item.image_url || 'https://via.placeholder.com/64x64?text=Velo'" 
                      :alt="item.title" 
                      class="w-full h-full object-cover"
                    >
                  </div>
                  <div class="ml-4 flex-grow">
                    <div class="text-[color:var(--color-dark)]">{{ item.title }}</div>
                    <div class="text-sm text-[color:var(--color-light-text)] mt-1">{{ item.quantity }} x {{ formatPrice(item.price_at_time) }} ₽</div>
                  </div>
                  <div class="text-sm text-[color:var(--color-accent)]">
                    {{ formatPrice(item.price_at_time * item.quantity) }} ₽
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
    
    <!-- Добавляем кнопку для обновления данных пользователя -->
    <div class="mt-8 p-4 border border-[color:var(--color-secondary)] rounded">
      <h3 class="text-lg font-medium mb-4">Дополнительные действия</h3>
      <div class="flex space-x-4">
        <button @click="refreshUserData" class="velo-btn velo-btn-primary">Обновить данные пользователя</button>
        <button v-if="isAdmin" @click="goToAdmin" class="velo-btn velo-btn-primary">Перейти в админ-панель</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

export default {
  name: 'AccountView',
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    
    // State
    const activeTab = ref('profile');
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const passwordError = ref('');
    const passwordUpdating = ref(false);
    
    const tabs = [
      { id: 'profile', title: 'Профиль' },
      { id: 'orders', title: 'История заказов' }
    ];
    
    // Computed properties
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    const user = computed(() => store.getters['auth/currentUser'] || {});
    const orders = computed(() => store.getters['orders/allOrders'] || []);
    const loading = computed(() => store.getters.isLoading);
    const isAdmin = computed(() => store.getters['auth/isAdmin']);
    
    const isPasswordFormValid = computed(() => {
      return (
        passwordForm.value.currentPassword.trim() !== '' &&
        passwordForm.value.newPassword.trim() !== '' &&
        passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
        passwordForm.value.newPassword.length >= 6
      );
    });
    
    // Watch for route query to set active tab
    onMounted(() => {
      if (route.query.tab && tabs.some(tab => tab.id === route.query.tab)) {
        activeTab.value = route.query.tab;
      }
      
      // Fetch orders if on orders tab
      if (activeTab.value === 'orders') {
        store.dispatch('orders/fetchOrders');
      }
    });
    
    // Watch for active tab changes to update route query
    watch(activeTab, (newTab) => {
      router.push({ query: { ...route.query, tab: newTab } });
      
      // Fetch orders if moving to orders tab
      if (newTab === 'orders') {
        store.dispatch('orders/fetchOrders');
      }
    });
    
    // Watch password form changes
    watch(() => passwordForm.value.confirmPassword, (newValue) => {
      if (newValue && passwordForm.value.newPassword !== newValue) {
        passwordError.value = 'Пароли не совпадают';
      } else {
        passwordError.value = '';
      }
    });
    
    // Methods
    const updatePassword = async () => {
      if (!isPasswordFormValid.value) return;
      
      passwordUpdating.value = true;
      
      try {
        const result = await store.dispatch('auth/updatePassword', {
          currentPassword: passwordForm.value.currentPassword,
          newPassword: passwordForm.value.newPassword
        });
        
        if (result.success) {
          passwordForm.value = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
        }
      } finally {
        passwordUpdating.value = false;
      }
    };
    
    const logout = () => {
      store.dispatch('auth/logout');
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    };
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('ru-RU').format(price);
    };
    
    const getOrderTotal = (order) => {
      return order.items.reduce((total, item) => {
        return total + (item.price_at_time * item.quantity);
      }, 0);
    };
    
    // Функция для обновления данных пользователя
    const refreshUserData = async () => {
      try {
        store.commit('setLoading', true, { root: true });
        // Получаем актуальные данные пользователя с сервера
        const result = await store.dispatch('auth/checkAuth');
        
        if (result && result.success) {
          toast.success('Данные пользователя успешно обновлены');
          
          // Проверяем, есть ли у пользователя права администратора
          if (isAdmin.value) {
            toast.info('У вас есть права администратора! Вы можете перейти в админ-панель.');
          }
        } else {
          toast.error('Не удалось обновить данные пользователя');
        }
      } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
        toast.error('Произошла ошибка при обновлении данных');
      } finally {
        store.commit('setLoading', false, { root: true });
      }
    };
    
    // Функция для перехода в админ-панель
    const goToAdmin = () => {
      router.push('/admin');
    };
    
    return {
      activeTab,
      tabs,
      passwordForm,
      passwordError,
      passwordUpdating,
      isPasswordFormValid,
      isAuthenticated,
      user,
      orders,
      loading,
      isAdmin,
      updatePassword,
      logout,
      formatDate,
      formatPrice,
      getOrderTotal,
      refreshUserData,
      goToAdmin
    };
  }
};
</script>
