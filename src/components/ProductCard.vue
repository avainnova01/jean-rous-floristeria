<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  whatsappNumber: {
    type: String,
    default: '573000000000'
  }
})

const emit = defineEmits(['add-to-cart', 'view-details'])

// Format price as "Desde $XX.000"
const formattedPrice = computed(() => {
  const priceFormatted = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0
  }).format(props.product.price)
  return `Desde $${priceFormatted}`
})

// WhatsApp query for this product
const whatsappQueryUrl = computed(() => {
  const message = encodeURIComponent(`Hola Jean Rous Floristería, me gustaría consultar disponibilidad y detalles sobre el arreglo: "${props.product.name}" (${formattedPrice.value}).`)
  return `https://wa.me/${props.whatsappNumber}?text=${message}`
})
</script>

<template>
  <div class="group bg-white rounded-[2rem] border border-beige hover:border-peach overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full hover:-translate-y-1">
    
    <!-- Image Area -->
    <div 
      @click="emit('view-details', product)"
      class="relative pt-[100%] overflow-hidden bg-stone-100 cursor-pointer"
    >
      <img 
        :src="product.image" 
        :alt="product.name" 
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <!-- Category Tag -->
      <span class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-beige px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-olive shadow-sm">
        {{ product.category === 'novias' ? 'Novias' : 
           product.category === 'amor' ? 'Amor y Amistad' :
           product.category === 'cumpleanos' ? 'Cumpleaños' :
           product.category === 'fiestas' ? 'Fiestas Especiales' :
           product.category === 'condolencias' ? 'Condolencias' : 'Ramos Personalizados' }}
      </span>
    </div>

    <!-- Details -->
    <div class="p-6 flex flex-col flex-grow">
      <h4 
        @click="emit('view-details', product)"
        class="font-serif text-lg font-bold text-stone-900 line-clamp-1 mb-1 group-hover:text-terracotta transition-colors cursor-pointer"
      >
        {{ product.name }}
      </h4>
      
      <p class="text-terracotta font-semibold text-sm tracking-wide mb-3">
        {{ formattedPrice }}
      </p>

      <p class="text-stone-500 text-xs font-light leading-relaxed mb-6 flex-grow line-clamp-2">
        {{ product.description }}
      </p>

      <!-- Actions -->
      <div class="space-y-2 mt-auto">
        <button 
          @click="emit('add-to-cart', product)"
          class="w-full flex items-center justify-center py-2.5 px-4 rounded-full bg-terracotta hover:bg-terracotta-dark text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all duration-300 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Agregar al pedido
        </button>

        <a 
          :href="whatsappQueryUrl"
          target="_blank"
          class="w-full flex items-center justify-center py-2.5 px-4 rounded-full border border-beige hover:border-gold text-stone-700 hover:text-stone-900 bg-cream/30 hover:bg-cream text-xs font-bold uppercase tracking-wider transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-[#25D366] fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.08-4.149c1.661.989 3.29 1.487 4.909 1.488 5.485-.002 9.945-4.461 9.949-9.947.002-2.657-1.03-5.155-2.906-7.033C16.314 2.483 13.82 1.45 11.168 1.45c-5.485 0-9.946 4.46-9.95 9.948-.002 1.93.504 3.633 1.47 5.267l-.999 3.649 3.737-.981zm13.16-5.14c-.33-.165-1.951-.963-2.251-1.072-.3-.11-.52-.165-.74.165-.22.33-.85 1.072-1.04 1.29-.19.22-.38.24-.71.075-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.64-1.953-1.832-2.28-.19-.33-.02-.507.144-.672.15-.148.33-.385.496-.578.165-.19.22-.33.33-.55.11-.22.05-.412-.025-.578-.075-.165-.74-1.782-1.012-2.44-.267-.643-.539-.556-.74-.566-.19-.01-.41-.01-.63-.01-.22 0-.58.08-.88.41-.3.33-1.15 1.127-1.15 2.75 0 1.62 1.18 3.19 1.34 3.41.165.22 2.328 3.555 5.637 4.98.787.34 1.4.54 1.88.697.79.25 1.51.215 2.08.13.634-.09 1.951-.798 2.227-1.57.275-.77.275-1.43.193-1.57-.083-.14-.303-.225-.634-.39z"/>
          </svg>
          Consultar
        </a>
      </div>
    </div>
  </div>
</template>
