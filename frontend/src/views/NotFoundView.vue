<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[color:var(--color-bg)]">
    <div class="max-w-xl w-full px-8 text-center">
      <!-- 404 Icon/Illustration -->
      <div class="text-[color:var(--color-accent)] mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-32 h-32 mx-auto" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Error message -->
      <h1 class="text-6xl font-light text-[color:var(--color-dark)] mb-4">404</h1>
      <h2 class="text-3xl font-medium text-[color:var(--color-dark)] mb-8">Страница не найдена</h2>
      <p class="text-lg text-[color:var(--color-light-text)] mb-8">
        Запрашиваемая страница не существует или была перемещена.
      </p>

      <!-- Navigation buttons -->
      <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <router-link 
          to="/" 
          class="velo-btn velo-btn-primary"
        >
          Вернуться на главную
        </router-link>
        <router-link 
          to="/shop" 
          class="velo-btn velo-btn-secondary"
        >
          Перейти в каталог
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script>
