<template>
  <div class="velo-container py-12 md:py-16">
    <h1 class="text-3xl font-light text-[color:var(--color-dark)] mb-16 text-center">Панель администратора</h1>
    
    <div class="bg-white border border-[color:var(--color-secondary)] overflow-hidden">
      <div class="border-b border-[color:var(--color-secondary)]">
        <nav class="flex">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-4 text-sm font-medium border-b-2 focus:outline-none transition duration-150',
              activeTab === tab.id 
                ? 'text-[color:var(--color-accent)] border-[color:var(--color-accent)]' 
                : 'text-[color:var(--color-light-text)] border-transparent hover:text-[color:var(--color-dark)] hover:border-[color:var(--color-secondary)]'
            ]"
          >
            {{ tab.title }}
          </button>
        </nav>
      </div>
      
      <div class="p-8">
        <!-- Products Tab -->
        <ProductsTab v-if="activeTab === 'products'" />
        
        <!-- Categories Tab (for future expansion) -->
        <div v-else-if="activeTab === 'categories'">
          <h2 class="text-xl font-medium text-[color:var(--color-dark)] mb-4">Управление категориями</h2>
          <p class="text-[color:var(--color-light-text)]">Функционал находится в разработке</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import ProductsTab from './ProductsTab.vue';

export default {
  name: 'AdminView',
  components: {
    ProductsTab
  },
  setup() {
    const activeTab = ref('products');
    
    const tabs = [
      { id: 'products', title: 'Товары' },
      { id: 'categories', title: 'Категории' }
    ];
    
    return {
      activeTab,
      tabs
    };
  }
};
</script>
