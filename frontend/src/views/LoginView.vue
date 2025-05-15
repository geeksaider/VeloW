<template>
  <div class="velo-container py-16 md:py-20">
    <div class="max-w-md mx-auto border border-[color:var(--color-secondary)]">
      <div class="p-8 md:p-12">
        <h1 class="text-2xl font-light text-[color:var(--color-dark)] mb-10 text-center">Вход в аккаунт</h1>
        
        <form @submit.prevent="login" class="space-y-8">
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
              placeholder="Введите ваш пароль"
            >
          </div>
          
          <div class="pt-4">
            <button 
              type="submit" 
              class="velo-btn velo-btn-primary w-full"
              :disabled="loading"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Входим...
              </span>
              <span v-else>Войти</span>
            </button>
            
            <div class="text-center text-[color:var(--color-light-text)] mt-8">
              Нет аккаунта? 
              <router-link to="/register" class="text-[color:var(--color-accent)] hover:border-b border-[color:var(--color-accent)]">
                Зарегистрироваться
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'LoginView',
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    
    // State
    const email = ref('');
    const password = ref('');
    
    // Computed
    const loading = computed(() => store.getters.isLoading);
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    
    // Methods
    const login = async () => {
      if (!email.value || !password.value) return;
      
      const credentials = {
        email: email.value,
        password: password.value
      };
      
      const result = await store.dispatch('auth/login', credentials);
      
      if (result.success) {
        // Redirect to the intended page or home
        const redirectPath = route.query.redirect || '/';
        router.push(redirectPath);
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
      loading,
      login
    };
  }
};
</script>
