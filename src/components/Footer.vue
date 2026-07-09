<script setup>
import logoUrl from '../assets/logo.jpeg'

const whatsappNumber = "573000000000" // Ajustable
const instagramUser = "jeanrous.floristeria" // Ajustable
const address = "Calle 10 # 5-25, Zona Centro" // Ajustable
const city = "Bogotá, Colombia" // Ajustable
const hoursWeekdays = "Lunes a Sábado: 8:00 AM - 7:00 PM" // Ajustable
const hoursSundays = "Domingos y Festivos: 9:00 AM - 2:00 PM" // Ajustable

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer id="contacto" class="bg-stone-900 text-stone-300 border-t border-stone-800 pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        <!-- Brand Info Column -->
        <div class="md:col-span-1 space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-gold/75 bg-cream">
              <img :src="logoUrl" alt="Jean Rous Logo" class="w-full h-full object-cover" />
            </div>
            <div class="flex flex-col">
              <span class="font-serif text-xl font-bold tracking-wide text-white">
                Jean Rous
              </span>
              <span class="text-[10px] tracking-[0.2em] uppercase text-peach font-semibold -mt-1">
                Floristería
              </span>
            </div>
          </div>
          <p class="text-sm font-light text-stone-400 leading-relaxed">
            Jean Rous Floristería — detalles que florecen emociones. Creamos composiciones a medida llenas de sofisticación y calidez.
          </p>
          <!-- Social Icons -->
          <div class="flex space-x-4">
            <!-- Instagram -->
            <a 
              :href="`https://instagram.com/${instagramUser}`" 
              target="_blank" 
              class="w-10 h-10 rounded-full bg-stone-800 hover:bg-terracotta text-white flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <!-- WhatsApp -->
            <a 
              :href="`https://wa.me/${whatsappNumber}`" 
              target="_blank" 
              class="w-10 h-10 rounded-full bg-stone-800 hover:bg-[#25D366] text-white flex items-center justify-center transition-colors"
              aria-label="WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.08-4.149c1.661.989 3.29 1.487 4.909 1.488 5.485-.002 9.945-4.461 9.949-9.947.002-2.657-1.03-5.155-2.906-7.033C16.314 2.483 13.82 1.45 11.168 1.45c-5.485 0-9.946 4.46-9.95 9.948-.002 1.93.504 3.633 1.47 5.267l-.999 3.649 3.737-.981zm13.16-5.14c-.33-.165-1.951-.963-2.251-1.072-.3-.11-.52-.165-.74.165-.22.33-.85 1.072-1.04 1.29-.19.22-.38.24-.71.075-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.64-1.953-1.832-2.28-.19-.33-.02-.507.144-.672.15-.148.33-.385.496-.578.165-.19.22-.33.33-.55.11-.22.05-.412-.025-.578-.075-.165-.74-1.782-1.012-2.44-.267-.643-.539-.556-.74-.566-.19-.01-.41-.01-.63-.01-.22 0-.58.08-.88.41-.3.33-1.15 1.127-1.15 2.75 0 1.62 1.18 3.19 1.34 3.41.165.22 2.328 3.555 5.637 4.98.787.34 1.4.54 1.88.697.79.25 1.51.215 2.08.13.634-.09 1.951-.798 2.227-1.57.275-.77.275-1.43.193-1.57-.083-.14-.303-.225-.634-.39z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Links Column 1 -->
        <div class="space-y-4">
          <h4 class="font-serif text-white font-bold text-base tracking-wide">Navegación</h4>
          <ul class="space-y-2.5 text-sm font-light text-stone-400">
            <li><a href="#inicio" class="hover:text-peach transition-colors">Inicio</a></li>
            <li><a href="#categorias" class="hover:text-peach transition-colors">Categorías</a></li>
            <li><a href="#productos" class="hover:text-peach transition-colors">Productos</a></li>
            <li><a href="#como-comprar" class="hover:text-peach transition-colors">Cómo comprar</a></li>
          </ul>
        </div>

        <!-- Contact details column -->
        <div class="space-y-4">
          <h4 class="font-serif text-white font-bold text-base tracking-wide">Contacto</h4>
          <ul class="space-y-3 text-sm font-light text-stone-400">
            <li class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-peach flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>
                {{ address }}<br />
                <span class="text-xs text-stone-500">{{ city }}</span>
              </span>
            </li>
            <li class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-peach flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a :href="`https://wa.me/${whatsappNumber}`" target="_blank" class="hover:text-peach transition-colors">
                +{{ whatsappNumber.slice(0,2) }} {{ whatsappNumber.slice(2,5) }} {{ whatsappNumber.slice(5,8) }} {{ whatsappNumber.slice(8) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Hours column -->
        <div class="space-y-4">
          <h4 class="font-serif text-white font-bold text-base tracking-wide">Horarios de Atención</h4>
          <ul class="space-y-2.5 text-sm font-light text-stone-400">
            <li class="flex flex-col">
              <span class="text-stone-500 text-xs uppercase tracking-wider font-semibold">Semana</span>
              <span>{{ hoursWeekdays }}</span>
            </li>
            <li class="flex flex-col">
              <span class="text-stone-500 text-xs uppercase tracking-wider font-semibold">Festivos</span>
              <span>{{ hoursSundays }}</span>
            </li>
          </ul>
        </div>

      </div>

      <!-- Copyright Area -->
      <div class="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 font-light">
        <p>&copy; {{ currentYear }} Jean Rous Floristería. Todos los derechos reservados.</p>
        <p class="mt-2 sm:mt-0">Diseño Elegante &amp; Boutique</p>
      </div>

    </div>
  </footer>
</template>
