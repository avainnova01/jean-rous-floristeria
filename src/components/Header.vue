<script setup>
import { ref } from 'vue'
import logoUrl from '../assets/logo.jpeg'

const props = defineProps({
  cartCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['open-cart'])

const isMenuOpen = ref(false)

const menuItems = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Categorías', href: '#categorias' },
  { name: 'Productos', href: '#productos' },
  { name: 'Cómo comprar', href: '#como-comprar' },
  { name: 'Contacto', href: '#contacto' }
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-beige shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        
        <!-- Logo Area -->
        <div class="flex-shrink-0 flex items-center">
          <a href="#inicio" class="flex items-center gap-3 group">
            <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-gold/75 shadow-inner transition-transform group-hover:rotate-6 duration-300">
              <img :src="logoUrl" alt="Jean Rous Logo" class="w-full h-full object-cover" />
            </div>
            <div class="flex flex-col">
              <span class="font-serif text-xl font-bold tracking-wide text-terracotta transition-colors group-hover:text-terracotta-dark">
                Jean Rous
              </span>
              <span class="text-[10px] tracking-[0.2em] uppercase text-olive font-semibold -mt-1">
                Floristería
              </span>
            </div>
          </a>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8">
          <a 
            v-for="item in menuItems" 
            :key="item.name" 
            :href="item.href"
            class="text-sm font-medium text-stone-600 hover:text-terracotta transition-colors relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-terracotta after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
          >
            {{ item.name }}
          </a>
        </nav>

        <!-- Right Side Controls (Cart & Button) -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- Cart Button -->
          <button 
            @click="emit('open-cart')"
            class="relative p-2 text-stone-600 hover:text-terracotta transition-colors focus:outline-none"
            aria-label="Ver pedido"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span 
              v-if="cartCount > 0"
              class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-terracotta rounded-full shadow-sm animate-pulse"
            >
              {{ cartCount }}
            </span>
          </button>

          <!-- WhatsApp Primary Link -->
          <a 
            href="https://wa.me/573000000000?text=Hola%20Jean%20Rous%20Florister%C3%ADa,%20me%20gustar%C3%ADa%20hacer%20una%20consulta%20personalizada."
            target="_blank"
            class="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-full text-white bg-terracotta hover:bg-terracotta-dark shadow-sm hover:shadow transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.08-4.149c1.661.989 3.29 1.487 4.909 1.488 5.485-.002 9.945-4.461 9.949-9.947.002-2.657-1.03-5.155-2.906-7.033C16.314 2.483 13.82 1.45 11.168 1.45c-5.485 0-9.946 4.46-9.95 9.948-.002 1.93.504 3.633 1.47 5.267l-.999 3.649 3.737-.981zm13.16-5.14c-.33-.165-1.951-.963-2.251-1.072-.3-.11-.52-.165-.74.165-.22.33-.85 1.072-1.04 1.29-.19.22-.38.24-.71.075-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.64-1.953-1.832-2.28-.19-.33-.02-.507.144-.672.15-.148.33-.385.496-.578.165-.19.22-.33.33-.55.11-.22.05-.412-.025-.578-.075-.165-.74-1.782-1.012-2.44-.267-.643-.539-.556-.74-.566-.19-.01-.41-.01-.63-.01-.22 0-.58.08-.88.41-.3.33-1.15 1.127-1.15 2.75 0 1.62 1.18 3.19 1.34 3.41.165.22 2.328 3.555 5.637 4.98.787.34 1.4.54 1.88.697.79.25 1.51.215 2.08.13.634-.09 1.951-.798 2.227-1.57.275-.77.275-1.43.193-1.57-.083-.14-.303-.225-.634-.39z"/>
            </svg>
            Comprar por WhatsApp
          </a>
        </div>

        <!-- Mobile Controls (Cart & Burger) -->
        <div class="flex md:hidden items-center space-x-2">
          <!-- Cart Button Mobile -->
          <button 
            @click="emit('open-cart')"
            class="relative p-2 text-stone-600 hover:text-terracotta transition-colors focus:outline-none"
            aria-label="Ver pedido"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span 
              v-if="cartCount > 0"
              class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-terracotta rounded-full shadow-sm"
            >
              {{ cartCount }}
            </span>
          </button>

          <!-- Burger Menu Button -->
          <button 
            @click="toggleMenu"
            class="p-2 rounded-md text-stone-600 hover:text-terracotta hover:bg-beige/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-terracotta transition-all"
            :aria-expanded="isMenuOpen"
          >
            <span class="sr-only">Abrir menú principal</span>
            <!-- Icon when menu is closed. -->
            <svg v-if="!isMenuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!-- Icon when menu is open. -->
            <svg v-else class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Menu panel -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-show="isMenuOpen" class="md:hidden border-b border-beige bg-cream/98">
        <div class="px-2 pt-2 pb-4 space-y-1 sm:px-3 shadow-inner">
          <a 
            v-for="item in menuItems" 
            :key="item.name" 
            :href="item.href"
            @click="closeMenu"
            class="block px-3 py-2.5 rounded-lg text-base font-medium text-stone-600 hover:text-terracotta hover:bg-peach/20 transition-all"
          >
            {{ item.name }}
          </a>
          
          <div class="pt-4 pb-2 border-t border-beige px-3 flex flex-col gap-3">
            <a 
              href="https://wa.me/573000000000?text=Hola%20Jean%20Rous%20Florister%C3%ADa,%20me%20gustar%C3%ADa%20hacer%20una%20consulta%20personalizada."
              target="_blank"
              class="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-semibold rounded-full text-white bg-terracotta hover:bg-terracotta-dark shadow-sm transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.08-4.149c1.661.989 3.29 1.487 4.909 1.488 5.485-.002 9.945-4.461 9.949-9.947.002-2.657-1.03-5.155-2.906-7.033C16.314 2.483 13.82 1.45 11.168 1.45c-5.485 0-9.946 4.46-9.95 9.948-.002 1.93.504 3.633 1.47 5.267l-.999 3.649 3.737-.981zm13.16-5.14c-.33-.165-1.951-.963-2.251-1.072-.3-.11-.52-.165-.74.165-.22.33-.85 1.072-1.04 1.29-.19.22-.38.24-.71.075-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.64-1.953-1.832-2.28-.19-.33-.02-.507.144-.672.15-.148.33-.385.496-.578.165-.19.22-.33.33-.55.11-.22.05-.412-.025-.578-.075-.165-.74-1.782-1.012-2.44-.267-.643-.539-.556-.74-.566-.19-.01-.41-.01-.63-.01-.22 0-.58.08-.88.41-.3.33-1.15 1.127-1.15 2.75 0 1.62 1.18 3.19 1.34 3.41.165.22 2.328 3.555 5.637 4.98.787.34 1.4.54 1.88.697.79.25 1.51.215 2.08.13.634-.09 1.951-.798 2.227-1.57.275-.77.275-1.43.193-1.57-.083-.14-.303-.225-.634-.39z"/>
              </svg>
              Comprar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>
