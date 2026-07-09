<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  cartItems: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'update-quantity', 'remove-item', 'clear-cart'])

// Configuration Number
const WHATSAPP_NUMBER = "573000000000" // Cambiar aquí el número de la floristería (Código país + número sin espacios)

// Form fields
const clientName = ref('')
const deliveryDate = ref('')
const deliveryAddress = ref('')
const cardMessage = ref('')
const specialNotes = ref('')

const isSubmitting = ref(false)
const showErrors = ref(false)

// Reset form validation when drawer opens/closes
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    showErrors.value = false
  }
})

// Subtotal calculation
const totalEstimated = computed(() => {
  return props.cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity)
  }, 0)
})

const formattedTotal = computed(() => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(totalEstimated.value)
})

// Validation
const isFormValid = computed(() => {
  return clientName.value.trim() !== '' && 
         deliveryDate.value.trim() !== '' && 
         deliveryAddress.value.trim() !== ''
})

// Format prices inside text
const formatPriceText = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)
}

// WhatsApp Checkout logic
const sendOrder = () => {
  if (!isFormValid.value) {
    showErrors.value = true
    return
  }

  isSubmitting.value = true
  
  // Format items list
  let itemsListText = ''
  props.cartItems.forEach((item, index) => {
    const itemSubtotal = item.product.price * item.quantity
    itemsListText += `${index + 1}. *${item.product.name}* x ${item.quantity} (${formatPriceText(item.product.price)} c/u) - Subtotal: ${formatPriceText(itemSubtotal)}\n`
  })

  // Format full message
  const message = 
`🌸 *JEAN ROUS FLORISTERÍA - NUEVO PEDIDO* 🌸

Hola Jean Rous Floristería, quiero confirmar disponibilidad y detalles de mi pedido:

👤 *Cliente:* ${clientName.value}
📅 *Fecha de entrega deseada:* ${deliveryDate.value}
📍 *Dirección/Zona de entrega:* ${deliveryAddress.value}

🛒 *Resumen del Pedido:*
${itemsListText}
💰 *Total Estimado:* ${formattedTotal.value}

💌 *Mensaje para la Tarjeta:*
"${cardMessage.value ? cardMessage.value : 'Sin mensaje personalizado.'}"

✍️ *Observaciones especiales:*
${specialNotes.value ? specialNotes.value : 'Ninguna.'}

---
Quedo atento(a) para confirmar disponibilidad, valor final y forma de pago. ✨`

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  
  // Open WhatsApp in new tab
  window.open(whatsappUrl, '_blank')
  
  isSubmitting.value = false
  emit('clear-cart')
  emit('close')
}
</script>

<template>
  <div v-show="isOpen" class="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
    <div class="absolute inset-0 overflow-hidden">
      <!-- Backdrop blur overlay -->
      <transition
        enter-active-class="ease-in-out duration-500"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in-out duration-500"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          @click="emit('close')"
          class="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity" 
          v-show="isOpen"
        ></div>
      </transition>

      <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <transition
          enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div v-show="isOpen" class="pointer-events-auto w-screen max-w-md">
            <div class="flex h-full flex-col overflow-y-scroll bg-cream shadow-2xl border-l border-beige">
              
              <!-- Drawer Header -->
              <div class="px-6 py-6 border-b border-beige bg-beige/30 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h2 class="text-xl font-serif font-bold text-stone-900">Tu Pedido</h2>
                </div>
                <button 
                  @click="emit('close')"
                  class="rounded-full p-2 text-stone-500 hover:text-terracotta hover:bg-beige/50 transition-all focus:outline-none"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Content Area -->
              <div class="flex-1 px-6 py-6 overflow-y-auto space-y-6">
                <!-- Cart Items List -->
                <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div class="w-20 h-20 rounded-full bg-peach/20 flex items-center justify-center text-terracotta/75">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p class="text-stone-700 font-serif text-lg font-semibold">El carrito está vacío</p>
                  <p class="text-stone-500 text-sm font-light max-w-xs">Agrega algunos de nuestros hermosos diseños para comenzar tu pedido.</p>
                  <button 
                    @click="emit('close')"
                    class="mt-2 inline-flex items-center px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-terracotta hover:bg-terracotta-dark shadow-sm transition-all"
                  >
                    Explorar catálogo
                  </button>
                </div>

                <div v-else class="space-y-4">
                  <h3 class="text-xs font-bold uppercase text-olive tracking-wider mb-2">Diseños seleccionados</h3>
                  
                  <div 
                    v-for="item in cartItems" 
                    :key="item.product.id"
                    class="flex items-center gap-4 bg-white p-3 rounded-2xl border border-beige/60 shadow-xs transition-shadow hover:shadow-sm"
                  >
                    <img 
                      :src="item.product.image" 
                      :alt="item.product.name" 
                      class="w-16 h-16 object-cover rounded-xl border border-beige flex-shrink-0"
                    />
                    
                    <div class="flex-grow min-w-0">
                      <h4 class="text-sm font-serif font-bold text-stone-900 truncate">{{ item.product.name }}</h4>
                      <p class="text-xs text-terracotta font-medium mt-0.5">{{ formatPriceText(item.product.price) }}</p>
                      
                      <!-- Quantity Controls -->
                      <div class="flex items-center mt-2 space-x-2">
                        <button 
                          @click="emit('update-quantity', { productId: item.product.id, quantity: item.quantity - 1 })"
                          class="w-6 h-6 rounded-full border border-beige bg-cream hover:bg-beige flex items-center justify-center text-stone-600 transition-colors"
                          :disabled="item.quantity <= 1"
                        >
                          -
                        </button>
                        <span class="text-xs font-semibold text-stone-800 w-6 text-center">{{ item.quantity }}</span>
                        <button 
                          @click="emit('update-quantity', { productId: item.product.id, quantity: item.quantity + 1 })"
                          class="w-6 h-6 rounded-full border border-beige bg-cream hover:bg-beige flex items-center justify-center text-stone-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <!-- Delete Button -->
                    <button 
                      @click="emit('remove-item', item.product.id)"
                      class="text-stone-400 hover:text-terracotta p-2 rounded-full hover:bg-peach/10 transition-all flex-shrink-0"
                      title="Eliminar de mi pedido"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Form Section -->
                <div v-if="cartItems.length > 0" class="border-t border-beige pt-6 space-y-4">
                  <h3 class="text-xs font-bold uppercase text-olive tracking-wider">Datos de Entrega</h3>
                  
                  <div class="space-y-3">
                    <div>
                      <label for="client-name" class="block text-xs font-semibold text-stone-700">Tu Nombre *</label>
                      <input 
                        type="text" 
                        id="client-name"
                        v-model="clientName"
                        placeholder="Ej. Sofía Rodríguez"
                        :class="[
                          'mt-1 block w-full px-3 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors',
                          showErrors && !clientName.trim() ? 'border-red-400 focus:ring-red-400' : 'border-beige focus:border-terracotta'
                        ]"
                      />
                    </div>

                    <div>
                      <label for="delivery-date" class="block text-xs font-semibold text-stone-700">Fecha de entrega deseada *</label>
                      <input 
                        type="date" 
                        id="delivery-date"
                        v-model="deliveryDate"
                        :class="[
                          'mt-1 block w-full px-3 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors',
                          showErrors && !deliveryDate.trim() ? 'border-red-400 focus:ring-red-400' : 'border-beige focus:border-terracotta'
                        ]"
                      />
                    </div>

                    <div>
                      <label for="delivery-address" class="block text-xs font-semibold text-stone-700">Dirección o zona de entrega *</label>
                      <input 
                        type="text" 
                        id="delivery-address"
                        v-model="deliveryAddress"
                        placeholder="Dirección completa o Municipio/Barrio"
                        :class="[
                          'mt-1 block w-full px-3 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors',
                          showErrors && !deliveryAddress.trim() ? 'border-red-400 focus:ring-red-400' : 'border-beige focus:border-terracotta'
                        ]"
                      />
                    </div>

                    <div>
                      <label for="card-message" class="block text-xs font-semibold text-stone-700">Mensaje para la tarjeta (Opcional)</label>
                      <textarea 
                        id="card-message"
                        v-model="cardMessage"
                        rows="3"
                        placeholder="Escribe el mensaje emotivo que irá en la dedicatoria..."
                        class="mt-1 block w-full px-3 py-2 border border-beige rounded-xl text-sm bg-white focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-colors"
                      ></textarea>
                    </div>

                    <div>
                      <label for="special-notes" class="block text-xs font-semibold text-stone-700">Observaciones especiales (Opcional)</label>
                      <textarea 
                        id="special-notes"
                        v-model="specialNotes"
                        rows="2"
                        placeholder="Ej. Tonalidades preferidas, hora específica, indicaciones de entrega..."
                        class="mt-1 block w-full px-3 py-2 border border-beige rounded-xl text-sm bg-white focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-colors"
                      ></textarea>
                    </div>
                  </div>

                  <p v-if="showErrors && !isFormValid" class="text-xs text-red-500 font-medium">
                    * Por favor, completa los campos requeridos para enviar tu pedido.
                  </p>
                </div>
              </div>

              <!-- Drawer Footer -->
              <div v-if="cartItems.length > 0" class="border-t border-beige bg-beige/30 p-6 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold text-stone-700">Total estimado:</span>
                  <span class="text-xl font-serif font-bold text-terracotta">{{ formattedTotal }}</span>
                </div>
                
                <div class="space-y-1">
                  <p class="text-[10px] text-stone-500 leading-tight text-center">
                    * La entrega final y costo de envío se confirmarán por chat.
                  </p>
                </div>

                <button 
                  @click="sendOrder"
                  :disabled="isSubmitting"
                  class="w-full flex items-center justify-center py-3.5 px-6 rounded-full bg-terracotta hover:bg-terracotta-dark text-white font-bold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.08-4.149c1.661.989 3.29 1.487 4.909 1.488 5.485-.002 9.945-4.461 9.949-9.947.002-2.657-1.03-5.155-2.906-7.033C16.314 2.483 13.82 1.45 11.168 1.45c-5.485 0-9.946 4.46-9.95 9.948-.002 1.93.504 3.633 1.47 5.267l-.999 3.649 3.737-.981zm13.16-5.14c-.33-.165-1.951-.963-2.251-1.072-.3-.11-.52-.165-.74.165-.22.33-.85 1.072-1.04 1.29-.19.22-.38.24-.71.075-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.64-1.953-1.832-2.28-.19-.33-.02-.507.144-.672.15-.148.33-.385.496-.578.165-.19.22-.33.33-.55.11-.22.05-.412-.025-.578-.075-.165-.74-1.782-1.012-2.44-.267-.643-.539-.556-.74-.566-.19-.01-.41-.01-.63-.01-.22 0-.58.08-.88.41-.3.33-1.15 1.127-1.15 2.75 0 1.62 1.18 3.19 1.34 3.41.165.22 2.328 3.555 5.637 4.98.787.34 1.4.54 1.88.697.79.25 1.51.215 2.08.13.634-.09 1.951-.798 2.227-1.57.275-.77.275-1.43.193-1.57-.083-.14-.303-.225-.634-.39z"/>
                  </svg>
                  Confirmar por WhatsApp
                </button>
              </div>

            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
