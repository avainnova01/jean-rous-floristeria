<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    required: true
  },
  whatsappNumber: {
    type: String,
    default: '573000000000'
  }
})

const emit = defineEmits(['close', 'add-to-cart'])

const quantity = ref(1)
const isZoomOpen = ref(false)

// Reset quantity when modal opens/closes or product changes
watch(() => props.product, () => {
  quantity.value = 1
  isZoomOpen.value = false
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

// Categories map
const categoryMap = {
  novias: 'Novias',
  amor: 'Amor y Amistad',
  cumpleanos: 'Cumpleaños',
  fiestas: 'Fiestas Especiales',
  condolencias: 'Condolencias',
  personalizados: 'Ramos Personalizados'
}

const categoryDisplayName = computed(() => {
  if (!props.product) return ''
  return categoryMap[props.product.category] || 'Diseño Exclusivo'
})

// Format price in Colombian Pesos
const formattedPrice = computed(() => {
  if (!props.product) return ''
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(props.product.price)
})

// SKU generator
const productSku = computed(() => {
  if (!props.product) return ''
  return `FLO-${props.product.id.toUpperCase()}`
})

// Handle increment/decrement
const increment = () => {
  quantity.value++
}

const decrement = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// Add to Cart action
const handleAddToCart = () => {
  if (!props.product) return
  emit('add-to-cart', { product: props.product, quantity: quantity.value })
  closeModal()
}

// Close Modal
const closeModal = () => {
  emit('close')
}

// WhatsApp redirect url with custom message including quantity and product info
const whatsappUrl = computed(() => {
  if (!props.product) return '#'
  const priceFormatted = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0
  }).format(props.product.price)
  
  const text = `Hola Jean Rous Floristería, estoy interesado en ver detalles y disponibilidad de este arreglo:
🌸 *${props.product.name}*
Cantidad: *${quantity.value}*
Precio Unitario: *Desde $${priceFormatted}*
Categoría: *${categoryDisplayName.value}*

¿Tienen disponibilidad para programar un envío? ¡Muchas gracias!`
  
  return `https://wa.me/${props.whatsappNumber}?text=${encodeURIComponent(text)}`
})
</script>

<template>
  <div>
    <!-- Main Modal Overlay -->
    <Transition name="modal">
      <div 
        v-if="isOpen && product" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-sm overflow-y-auto"
        @click.self="closeModal"
      >
        <!-- Modal Card Content -->
        <div class="modal-content relative bg-cream rounded-[2.5rem] w-full max-w-5xl shadow-2xl overflow-hidden border border-beige my-8 max-h-[90vh] overflow-y-auto sm:max-h-none">
          
          <!-- Close Button -->
          <button 
            @click="closeModal"
            class="absolute top-6 right-6 z-10 bg-white/80 backdrop-blur-xs text-stone-600 hover:text-terracotta border border-beige hover:border-peach shadow-sm hover:shadow p-2.5 rounded-full transition-all duration-300 focus:outline-none"
            aria-label="Cerrar"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Grid Layout -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 p-6 sm:p-10 md:p-12">
            
            <!-- Left Column: Graphical framed image -->
            <div class="md:col-span-5 flex flex-col justify-start">
              <div class="relative w-full aspect-square rounded-[2rem] border border-beige bg-peach-light/30 overflow-hidden shadow-inner p-4 sm:p-6 flex items-center justify-center">
                <div class="relative w-full h-full rounded-[1.5rem] overflow-hidden shadow-md group/img bg-white">
                  <img 
                    :src="product.image" 
                    :alt="product.name" 
                    class="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                  />
                  <!-- Zoom trigger -->
                  <button 
                    @click="isZoomOpen = true"
                    class="absolute top-4 right-4 bg-white/90 backdrop-blur-xs border border-beige p-2.5 rounded-full text-stone-700 hover:text-terracotta hover:bg-white shadow-sm hover:shadow hover:scale-110 transition-all duration-300 cursor-pointer focus:outline-none"
                    title="Zoom de imagen"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Right Column: Product E-commerce details -->
            <div class="md:col-span-7 flex flex-col justify-between space-y-6">
              
              <!-- Breadcrumbs -->
              <div>
                <nav class="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 font-light mb-4">
                  <span class="hover:text-terracotta transition-colors">Inicio</span>
                  <span class="text-stone-300">/</span>
                  <span class="hover:text-terracotta transition-colors">Ramos de Flores</span>
                  <span class="text-stone-300">/</span>
                  <span class="bg-peach-light/60 text-terracotta border border-peach/30 px-2.5 py-0.5 rounded-full font-semibold text-[9px] uppercase tracking-wider">
                    {{ categoryDisplayName }}
                  </span>
                  <span class="text-stone-300">/</span>
                  <span class="text-stone-600 font-normal truncate max-w-[150px] sm:max-w-none">{{ product.name }}</span>
                </nav>

                <!-- Product Name -->
                <h2 class="font-serif text-2xl sm:text-3.5xl font-bold text-stone-900 leading-tight mb-3">
                  {{ product.name }}
                </h2>

                <!-- Description -->
                <p class="text-stone-600 text-sm sm:text-base font-light leading-relaxed mb-6">
                  {{ product.description }}
                </p>
              </div>

              <!-- Price & Quantity & Actions Area -->
              <div class="space-y-6 border-t border-beige/60 pt-6">
                <!-- Price Display -->
                <div class="flex items-baseline space-x-2">
                  <span class="text-xs text-stone-400 font-bold uppercase tracking-wider">Precio:</span>
                  <span class="text-2xl sm:text-3xl font-serif font-bold text-terracotta">
                    Desde {{ formattedPrice }}
                  </span>
                </div>

                <!-- Actions Stack -->
                <div class="space-y-3">
                  <!-- Row 1: Quantity and Agregar al Pedido -->
                  <div class="flex flex-col sm:flex-row gap-3">
                    <!-- Quantity Selector -->
                    <div class="flex items-center justify-between sm:justify-start border border-beige rounded-full bg-white px-3 py-2 shadow-xs sm:w-auto">
                      <button 
                        @click="decrement"
                        class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-beige/40 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer text-lg font-bold"
                        :disabled="quantity <= 1"
                      >
                        -
                      </button>
                      <span class="text-sm font-semibold text-stone-800 w-10 text-center select-none">{{ quantity }}</span>
                      <button 
                        @click="increment"
                        class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-beige/40 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer text-lg font-bold"
                      >
                        +
                      </button>
                    </div>

                    <!-- "Agregar al pedido" Button -->
                    <button 
                      @click="handleAddToCart"
                      class="flex-1 py-3.5 px-6 rounded-full bg-terracotta hover:bg-terracotta-dark text-white font-bold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Agregar al pedido
                    </button>
                  </div>

                  <!-- Row 2: WhatsApp Link Button -->
                  <a 
                    :href="whatsappUrl"
                    target="_blank"
                    class="w-full flex items-center justify-center py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition-all duration-300 gap-2 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.08-4.149c1.661.989 3.29 1.487 4.909 1.488 5.485-.002 9.945-4.461 9.949-9.947.002-2.657-1.03-5.155-2.906-7.033C16.314 2.483 13.82 1.45 11.168 1.45c-5.485 0-9.946 4.46-9.95 9.948-.002 1.93.504 3.633 1.47 5.267l-.999 3.649 3.737-.981zm13.16-5.14c-.33-.165-1.951-.963-2.251-1.072-.3-.11-.52-.165-.74.165-.22.33-.85 1.072-1.04 1.29-.19.22-.38.24-.71.075-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.64-1.953-1.832-2.28-.19-.33-.02-.507.144-.672.15-.148.33-.385.496-.578.165-.19.22-.33.33-.55.11-.22.05-.412-.025-.578-.075-.165-.74-1.782-1.012-2.44-.267-.643-.539-.556-.74-.566-.19-.01-.41-.01-.63-.01-.22 0-.58.08-.88.41-.3.33-1.15 1.127-1.15 2.75 0 1.62 1.18 3.19 1.34 3.41.165.22 2.328 3.555 5.637 4.98.787.34 1.4.54 1.88.697.79.25 1.51.215 2.08.13.634-.09 1.951-.798 2.227-1.57.275-.77.275-1.43.193-1.57-.083-.14-.303-.225-.634-.39z"/>
                    </svg>
                    Consultar disponibilidad por WhatsApp
                  </a>
                </div>

                <!-- SKU Code -->
                <div class="text-[11px] text-stone-500 font-mono pt-2">
                  SKU: <span class="font-semibold text-stone-700">{{ productSku }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Transition>

    <!-- Zoom/Lightbox Overlay -->
    <Transition name="lightbox">
      <div 
        v-if="isZoomOpen && product" 
        class="fixed inset-0 z-60 bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        @click="isZoomOpen = false"
      >
        <button 
          @click="isZoomOpen = false"
          class="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 focus:outline-none"
          aria-label="Cerrar zoom"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <img 
          :src="product.image" 
          :alt="product.name" 
          class="max-w-full max-h-[85vh] md:max-h-[90vh] object-contain rounded-2xl shadow-2xl animate-zoom-in"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.96) translateY(12px);
  opacity: 0;
}

/* Lightbox Transition */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-enter-active img,
.lightbox-leave-active img {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.lightbox-enter-from img,
.lightbox-leave-to img {
  transform: scale(0.95);
}

@keyframes zoom-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-zoom-in {
  animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Custom Scrollbar for the modal content if it overflows */
.modal-content::-webkit-scrollbar {
  width: 6px;
}
.modal-content::-webkit-scrollbar-track {
  background: transparent;
}
.modal-content::-webkit-scrollbar-thumb {
  background: var(--color-beige);
  border-radius: 3px;
}
.modal-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-olive-light);
}
</style>
