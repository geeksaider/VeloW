<template>
  <div class="velo-container py-16 md:py-20">
    <div class="max-w-md mx-auto border border-[color:var(--color-secondary)]">
      <div class="p-8 md:p-12">
        <h1 class="text-2xl font-light text-[color:var(--color-dark)] mb-10 text-center">Регистрация</h1>
        
        <form @submit.prevent="register" class="space-y-6">
          <div>
            <label for="email" class="velo-label">Email</label>
            <input 
              id="email" 
              type="email" 
              v-model="email" 
              class="velo-input w-full" 
              required
              placeholder="Введите ваш email"
            >
          </div>
          
          <div>
            <label for="password" class="velo-label">Пароль</label>
            <input 
              id="password" 
              type="password" 
              v-model="password" 
              class="velo-input w-full" 
              required
              placeholder="Введите пароль"
              minlength="6"
            >
            <p class="text-xs text-[color:var(--color-light-text)] mt-2">Минимум 6 символов</p>
          </div>
          
          <div>
            <label for="passwordConfirm" class="velo-label">Подтверждение пароля</label>
            <input 
              id="passwordConfirm" 
              type="password" 
              v-model="passwordConfirm" 
              class="velo-input w-full" 
              required
              placeholder="Повторите пароль"
              minlength="6"
            >
            <p v-if="passwordError" class="text-xs text-red-500 mt-2">
              {{ passwordError }}
            </p>
          </div>
          
          <div class="pt-4">
            <button 
              type="submit" 
              class="velo-btn velo-btn-primary w-full"
              :disabled="loading || !isFormValid"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Регистрация...
              </span>
              <span v-else>Зарегистрироваться</span>
            </button>
            
            <div class="text-center text-[color:var(--color-light-text)] mt-8">
              Уже есть аккаунт? 
              <router-link to="/login" class="text-[color:var(--color-accent)] hover:border-b border-[color:var(--color-accent)]">
                Войти
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'RegisterView',
  setup() {
    const store = useStore();
    const router = useRouter();
    
    // State
    const email = ref('');
    const password = ref('');
    const passwordConfirm = ref('');
    const passwordError = ref('');
    
    // Computed
    const loading = computed(() => store.getters.isLoading);
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    
    const isFormValid = computed(() => {
      return (
        email.value.trim() !== '' &&
        password.value.trim() !== '' &&
        password.value === passwordConfirm.value &&
        password.value.length >= 6
      );
    });
    
    // Watch for password confirmation
    watch([password, passwordConfirm], ([newPassword, newPasswordConfirm]) => {
      if (newPasswordConfirm && newPassword !== newPasswordConfirm) {
        passwordError.value = 'Пароли не совпадают';
      } else {
        passwordError.value = '';
      }
    });
    
    // Methods
    const register = async () => {
      if (!isFormValid.value) return;
      
      try {
        // Показываем индикатор загрузки вручную, если в будущем будут проблемы с диспетчером
        store.commit('SET_LOADING', true, { root: true });
        
        const userData = {
          email: email.value,
          password: password.value
        };
        
        console.log('Отправка данных для регистрации:', userData.email);
        
        const result = await store.dispatch('auth/register', userData);
        
        if (result.success) {
          // Успешно зарегистрировались
          console.log('Регистрация успешна!');
          router.push('/');
        } else {
          console.error('Ошибка при регистрации:', result.message);
          // Дополнительная обработка ошибок в компоненте, если нужно
        }
      } catch (error) {
        console.error('Непредвиденная ошибка при регистрации:', error);
        // Если vuex вызвал исключение, обрабатываем его здесь
        alert('Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.');
      } finally {
        // Убираем индикатор загрузки вручную
        store.commit('SET_LOADING', false, { root: true });
      }
    };
    
    // Lifecycle hooks
    onMounted(() => {
      // If already logged in, redirect to home
      if (isAuthenticated.value) {
        router.push('/');
      }
    });
    
    return {
      email,
      password,
      passwordConfirm,
      passwordError,
      loading,
      isFormValid,
      register
    };
  }
};
</script>
