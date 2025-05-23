<template>
  <div class="min-h-screen flex flex-col bg-[color:var(--color-bg)]">
    <!-- Minimal aesthetic header with subtle animations -->
    <header class="velo-header" v-if="$route.name !== 'not-found'">
      <div class="velo-container py-4 flex justify-between items-center">
        <router-link to="/" class="flex items-center space-x-2">
          <div class="text-[color:var(--color-accent)] uppercase tracking-widest text-lg md:text-xl">Velo</div>
        </router-link>
        <!-- Minimal navigation with elegant hover effects -->        
        <nav class="hidden md:flex items-center space-x-8">
          <router-link 
            to="/" 
            class="velo-nav-link" 
            :class="{ active: isActiveNav('/') }"
          >Коллекции</router-link>
          <router-link 
            to="/shop" 
            class="velo-nav-link" 
            :class="{ active: isActiveNav('/shop') }"
          >Каталог</router-link>
          <router-link 
            to="/new" 
            class="velo-nav-link" 
            :class="{ active: isActiveNav('/new') }"
          >Новинки</router-link>
          <router-link 
            to="/about" 
            class="velo-nav-link" 
            :class="{ active: isActiveNav('/about') }"
          >О нас</router-link>
        </nav>
        
        <div class="flex items-center space-x-6">
          <!-- Utility links with subtle icons -->          
          <router-link to="/cart" class="relative hover:text-[color:var(--color-accent)]" aria-label="Корзина">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span v-if="cartItemsCount > 0" class="velo-badge">{{ cartItemsCount }}</span>
          </router-link>
          
          <router-link v-if="isAuthenticated" to="/account" class="hover:text-[color:var(--color-accent)]" aria-label="Аккаунт">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </router-link>
          
          <router-link v-else to="/login" class="hover:text-[color:var(--color-accent)]" aria-label="Войти">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </router-link>
          
          <!-- Mobile menu button, visible only on small screens -->          
          <button class="md:hidden hover:text-[color:var(--color-accent)]" @click="toggleMobileMenu" aria-label="Меню">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile menu overlay -->      
      <div v-if="mobileMenuOpen" class="velo-mobile-menu">
        <button class="absolute top-6 right-6 hover:text-[color:var(--color-accent)]" @click="toggleMobileMenu" aria-label="Закрыть меню">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="flex flex-col items-center space-y-6">
          <router-link to="/" class="velo-menu-item" :class="{ active: isActiveNav('/') }" @click="closeMobileMenu">Коллекции</router-link>
          <router-link to="/shop" class="velo-menu-item" :class="{ active: isActiveNav('/shop') }" @click="closeMobileMenu">Каталог</router-link>
          <router-link to="/new" class="velo-menu-item" :class="{ active: isActiveNav('/new') }" @click="closeMobileMenu">Новинки</router-link>
          <router-link to="/about" class="velo-menu-item" :class="{ active: isActiveNav('/about') }" @click="closeMobileMenu">О нас</router-link>
          <router-link to="/cart" class="velo-menu-item" :class="{ active: isActiveNav('/cart') }" @click="closeMobileMenu">Корзина</router-link>
          <router-link v-if="isAuthenticated" to="/account" class="velo-menu-item" :class="{ active: isActiveNav('/account') }" @click="closeMobileMenu">Аккаунт</router-link>
          <router-link v-else to="/login" class="velo-menu-item" :class="{ active: isActiveNav('/login') }" @click="closeMobileMenu">Войти</router-link>
        </div>
      </div>
    </header>

    <main class="flex-grow">
      <!-- Aesthetic hero section with minimal design -->
      <section v-if="$route.path === '/'" class="velo-hero">
        <div class="velo-hero-bg">
          <img src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1800&q=80" alt="Интерьер в эстетичном стиле" />
        </div>
        
        <div class="velo-hero-content fade-in">
          <h1 class="velo-hero-title">Эстетика уюта и красоты</h1>
          <p class="velo-hero-subtitle">Создайте пространство, отражающее вашу индивидуальность и стиль</p>
          <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <router-link to="/shop" class="velo-btn velo-btn-primary">Открыть каталог</router-link>
            <a href="#collections" class="velo-btn velo-btn-secondary">Новые коллекции</a>
          </div>
        </div>
      </section>

      <PageTransition>
        <router-view />
      </PageTransition>

      <!-- Collection showcase with elegant grid layout -->
      <section v-if="$route.path === '/'" id="collections" class="velo-section">
        <div class="velo-container">
          <h2 class="text-center text-3xl md:text-4xl font-light tracking-tight text-[color:var(--color-dark)] mb-6">Коллекции</h2>
          <div class="velo-divider"></div>
          <p class="max-w-xl mx-auto text-center mb-12">Откройте для себя коллекции, сочетающие в себе стиль, функциональность и уникальность</p>
          
          <div class="velo-collection">
            <div class="velo-collection-item">
              <img src="https://www.prorabneva.ru/storage/post_content/February2023/kau3nKrFMKrR3biQqAKj.jpg" alt="Минималистичный свет" />
              <div class="velo-collection-title">Минималистичный свет</div>
            </div>
            <div class="velo-collection-item">
              <img src="https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Текстиль и ткани" />
              <div class="velo-collection-title">Текстиль и ткани</div>
            </div>
            <div class="velo-collection-item">
              <img src="https://images.unsplash.com/photo-1493552152660-f915ab47ae9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Декоративные элементы" />
              <div class="velo-collection-title">Декоративные элементы</div>
            </div>
            <div class="velo-collection-item">
              <img src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Керамическая посуда" />
              <div class="velo-collection-title">Керамическая посуда</div>
            </div>
            <div class="velo-collection-item">
              <img src="https://images.unsplash.com/photo-1554295405-abb8fd54f153?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Живые растения" />
              <div class="velo-collection-title">Живые растения</div>
            </div>
            <div class="velo-collection-item">
              <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Настенный декор" />
              <div class="velo-collection-title">Настенный декор</div>
            </div>
          </div>
          
          <div class="text-center mt-12">
            <router-link to="/shop" class="velo-btn velo-btn-secondary">Смотреть все коллекции</router-link>
          </div>
        </div>
      </section>
      
      <!-- Brand values with subtle design -->
      <section v-if="$route.path === '/'" class="velo-section bg-[color:var(--color-primary)]">
        <div class="velo-container">
          <h2 class="text-center text-3xl md:text-4xl font-light tracking-tight text-[color:var(--color-dark)] mb-6">Наши ценности</h2>
          <div class="velo-divider"></div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
            <div class="flex flex-col items-center fade-in">
              <div class="velo-icon-circle mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 class="text-xl font-light mb-3 text-center">Эстетика</h3>
              <p class="text-center">Каждый предмет создан с вниманием к деталям и утонченным чувством стиля</p>
            </div>
            
            <div class="flex flex-col items-center fade-in" style="animation-delay: 0.2s;">
              <div class="velo-icon-circle mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 class="text-xl font-light mb-3 text-center">Качество</h3>
              <p class="text-center">Мы используем только лучшие материалы и производственные процессы</p>
            </div>
            
            <div class="flex flex-col items-center fade-in" style="animation-delay: 0.4s;">
              <div class="velo-icon-circle mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-light mb-3 text-center">Уют</h3>
              <p class="text-center">Наши товары созданы, чтобы наполнить ваш дом теплом и гармонией</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Elegant testimonials section -->
      <section v-if="$route.path === '/'" class="velo-section">
        <div class="velo-container">
          <h2 class="text-center text-3xl md:text-4xl font-light tracking-tight text-[color:var(--color-dark)] mb-6">Отзывы</h2>
          <div class="velo-divider"></div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 mt-12">
            <div class="velo-testimonial hover-lift">
              <p class="velo-testimonial-text">«Приобрела несколько предметов декора для гостиной. Качество превзошло все ожидания, а доставка была очень быстрой!»</p>
              <div class="velo-testimonial-author">
                <div class="velo-testimonial-avatar"></div>
                <div>
                  <p class="font-medium text-[color:var(--color-dark)]">Анна К.</p>
                  <p class="text-sm text-[color:var(--color-light-text)]">Москва</p>
                </div>
              </div>
            </div>
            
            <div class="velo-testimonial hover-lift">
              <p class="velo-testimonial-text">«Отличный магазин с прекрасным сервисом. Заказываю уже третий раз и всегда остаюсь довольна качеством товаров.»</p>
              <div class="velo-testimonial-author">
                <div class="velo-testimonial-avatar"></div>
                <div>
                  <p class="font-medium text-[color:var(--color-dark)]">Иван П.</p>
                  <p class="text-sm text-[color:var(--color-light-text)]">Санкт-Петербург</p>
                </div>
              </div>
            </div>
            
            <div class="velo-testimonial hover-lift">
              <p class="velo-testimonial-text">«Купил подарок жене на годовщину. Она была в восторге! Спасибо за внимательное отношение и помощь в выборе.»</p>
              <div class="velo-testimonial-author">
                <div class="velo-testimonial-avatar"></div>
                <div>
                  <p class="font-medium text-[color:var(--color-dark)]">Михаил Д.</p>
                  <p class="text-sm text-[color:var(--color-light-text)]">Казань</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="velo-footer"  v-if="$route.name !== 'not-found'">
      <div class="velo-container py-16 md:py-20">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div class="md:col-span-4 lg:col-span-5">
            <div class="flex items-center mb-6">
              <div class="text-[color:var(--color-accent)] uppercase tracking-widest text-xl">Velo</div>
            </div>
            <p class="text-[color:var(--color-light-text)] mb-6">Магазин декора и аксессуаров для дома в эстетичном минималистичном стиле. Создайте пространство, которое отражает вашу индивидуальность.</p>
            <div class="flex space-x-5">
              <a href="#" class="text-[color:var(--color-accent)]" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </a>
              <a href="#" class="text-[color:var(--color-accent)]" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                </svg>
              </a>
              <a href="#" class="text-[color:var(--color-accent)]" aria-label="Pinterest">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0z"/>
                </svg>
              </a>
            </div>
          </div>
          <div class="md:col-span-4 lg:col-span-3">
            <h4 class="text-lg text-[color:var(--color-dark)] font-light mb-6">Навигация</h4>
            <ul class="space-y-4">
              <li><router-link to="/" class="text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)]">Главная</router-link></li>
              <li><router-link to="/shop" class="text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)]">Каталог</router-link></li>
              <li><router-link to="/cart" class="text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)]">Корзина</router-link></li>
              <li><router-link to="/account" class="text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)]">Личный кабинет</router-link></li>
            </ul>
          </div>
          
          <div class="md:col-span-4 lg:col-span-4">
            <h4 class="text-lg text-[color:var(--color-dark)] font-light mb-6">Контакты</h4>
            <ul class="space-y-4">
              <li class="flex items-center">
                <span class="text-[color:var(--color-accent)] mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <a href="mailto:info@velo.ru" class="text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)]">info@velo.ru</a>
              </li>
              <li class="flex items-center">
                <span class="text-[color:var(--color-accent)] mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <a href="tel:+78001234567" class="text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)]">+7 (800) 123-45-67</a>
              </li>
              <li class="flex items-start">
                <span class="text-[color:var(--color-accent)] mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span class="text-[color:var(--color-light-text)]">г. Москва, ул. Примерная, 123</span>
              </li>
              <li class="mt-6">
                <form class="flex">
                  <input type="email" placeholder="Ваш email" class="velo-input rounded-none py-2 px-4 w-full max-w-xs" />
                  <button type="submit" class="velo-btn velo-btn-primary py-2 px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="mt-16 pt-8 border-t border-[color:var(--color-secondary)] text-center">
          <p class="text-[color:var(--color-light-text)]">&copy; {{ new Date().getFullYear() }} Velo. Все права защищены.</p>
          <div class="mt-4 flex flex-wrap justify-center gap-8">
            <a href="#" class="text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)] text-sm">Политика конфиденциальности</a>
            <a href="#" class="text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)] text-sm">Условия использования</a>
            <a href="#" class="text-[color:var(--color-light-text)] hover:text-[color:var(--color-accent)] text-sm">Доставка и оплата</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PageTransition from './components/PageTransition.vue';

export default {
  name: 'App',
  components: {
    PageTransition
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated',
      cartItemsCount: 'cart/cartItemsCount'
    })
  },
  methods: {
    isActiveNav(path) {
      // Exact match for root, partial for others (e.g. /shop/123 is active for /shop)
      if (path === '/') {
        return this.$route.path === '/';
      }
      return this.$route.path.startsWith(path);
    }
  }
}
</script>
