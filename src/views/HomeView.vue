<script setup>
import { ref, computed, onMounted } from 'vue'

// Import components
import Header from '../components/Header.vue'
import Hero from '../components/Hero.vue'
import PromoBanner from '../components/PromoBanner.vue'
import CategoryCard from '../components/CategoryCard.vue'
import ProductCard from '../components/ProductCard.vue'
import CartDrawer from '../components/CartDrawer.vue'
import HowToBuy from '../components/HowToBuy.vue'
import TrustSection from '../components/TrustSection.vue'
import Footer from '../components/Footer.vue'
import ProductDetailModal from '../components/ProductDetailModal.vue'

// Import product & category local fallback data
import { CATEGORIES as LOCAL_CATEGORIES, PRODUCTS as LOCAL_PRODUCTS } from '../data/products'

// Import Firebase services
import { fetchCategories, fetchProducts, getGeneralSettings } from '../services/firebase'

// App State
const cart = ref([])
const isCartOpen = ref(false)
const selectedCategory = ref('todos') // Default filters showing 'todos'
const selectedProductForDetail = ref(null)
const isDetailOpen = ref(false)

// Firestore reactive state
const categoriesList = ref([])
const productsList = ref([])
const whatsappNumber = ref('573000000000')
const isLoading = ref(true)

// Fetch all dynamic data from Firebase
onMounted(async () => {
  try {
    // 1. Fetch settings for WhatsApp number
    const settings = await getGeneralSettings()
    if (settings && settings.whatsappNumber) {
      whatsappNumber.value = settings.whatsappNumber
    }

    // 2. Fetch categories from Firestore (only active)
    const dbCategories = await fetchCategories(true)
    if (dbCategories && dbCategories.length > 0) {
      categoriesList.value = dbCategories
    } else {
      categoriesList.value = LOCAL_CATEGORIES
    }

    // 3. Fetch products from Firestore (only active)
    const dbProducts = await fetchProducts(true)
    if (dbProducts && dbProducts.length > 0) {
      productsList.value = dbProducts
    } else {
      productsList.value = LOCAL_PRODUCTS
    }
  } catch (error) {
    console.error("Firestore loading failed. Falling back to local arrays.", error)
    categoriesList.value = LOCAL_CATEGORIES
    productsList.value = LOCAL_PRODUCTS
  } finally {
    isLoading.value = false
  }
})

// Calculate total items in the cart
const totalCartCount = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0)
})

// Filtered products computed list
const filteredProducts = computed(() => {
  if (selectedCategory.value === 'todos') {
    return productsList.value
  }
  return productsList.value.filter(product => product.category === selectedCategory.value)
})

// Scroll helper to target element id
const scrollToId = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Handle category selection and auto-scroll to the catalog
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  setTimeout(() => {
    scrollToId('productos')
  }, 100)
}

// Cart operations
const addToCart = (productOrPayload) => {
  let product = productOrPayload
  let quantityToAdd = 1

  // Handle payload from ProductDetailModal: { product, quantity }
  if (productOrPayload && productOrPayload.product && productOrPayload.quantity !== undefined) {
    product = productOrPayload.product
    quantityToAdd = productOrPayload.quantity
  }

  const existingItemIndex = cart.value.findIndex(item => item.product.id === product.id)
  if (existingItemIndex > -1) {
    cart.value[existingItemIndex].quantity += quantityToAdd
  } else {
    cart.value.push({ product, quantity: quantityToAdd })
  }
  // Open the cart drawer automatically to give instant feedback
  isCartOpen.value = true
}

const openProductDetail = (product) => {
  selectedProductForDetail.value = product
  isDetailOpen.value = true
}

const updateQuantity = ({ productId, quantity }) => {
  const itemIndex = cart.value.findIndex(item => item.product.id === productId)
  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.value.splice(itemIndex, 1)
    } else {
      cart.value[itemIndex].quantity = quantity
    }
  }
}

const removeItem = (productId) => {
  const itemIndex = cart.value.findIndex(item => item.product.id === productId)
  if (itemIndex > -1) {
    cart.value.splice(itemIndex, 1)
  }
}

const clearCart = () => {
  cart.value = []
}
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans antialiased text-stone-800 bg-cream">
    
    <!-- Top Header Navigation -->
    <Header :cartCount="totalCartCount" @open-cart="isCartOpen = true" />

    <!-- Hero Showcase Section -->
    <Hero :whatsappNumber="whatsappNumber" @scroll-to-catalog="scrollToId('categorias')" />

    <!-- Promotional Custom Ribbon -->
    <PromoBanner />

    <!-- Categories Section -->
    <section id="categorias" class="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
          Nuestras Colecciones
        </h2>
        <div class="w-16 h-1 bg-terracotta mx-auto mt-4 rounded-full"></div>
        <p class="mt-4 text-stone-600 font-light text-sm sm:text-base leading-relaxed">
          Diseños elaborados artesanalmente con flores frescas de la más alta calidad, inspirados en emociones y momentos especiales.
        </p>
      </div>

      <!-- Loading Placeholder -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 space-y-4">
        <div class="w-12 h-12 rounded-full border-4 border-beige border-t-terracotta animate-spin"></div>
        <p class="text-xs text-stone-500 font-medium">Cargando colecciones Jean Rous...</p>
      </div>

      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <CategoryCard 
          v-for="category in categoriesList" 
          :key="category.id" 
          :category="category"
          :isSelected="selectedCategory === category.id"
          @select-category="selectCategory"
        />
      </div>
    </section>

    <!-- Product Catalog Section -->
    <section id="productos" class="py-16 sm:py-24 bg-beige/25 border-t border-b border-beige/40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 class="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              Catálogo de Arreglos
            </h2>
            <div class="w-16 h-1 bg-terracotta mt-4 rounded-full"></div>
          </div>
          
          <!-- Quick filters for desktop / tablet -->
          <div v-if="!isLoading" class="mt-6 md:mt-0 flex flex-wrap gap-2">
            <button 
              @click="selectedCategory = 'todos'"
              :class="[
                'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer',
                selectedCategory === 'todos' 
                  ? 'bg-terracotta text-white shadow-sm' 
                  : 'bg-white text-stone-600 border border-beige hover:border-peach hover:text-terracotta'
              ]"
            >
              Todos
            </button>
            <button 
              v-for="cat in categoriesList"
              :key="cat.id"
              @click="selectedCategory = cat.id"
              :class="[
                'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer',
                selectedCategory === cat.id 
                  ? 'bg-terracotta text-white shadow-sm' 
                  : 'bg-white text-stone-600 border border-beige hover:border-peach hover:text-terracotta'
              ]"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>

        <!-- Loading Placeholder -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 space-y-4">
          <div class="w-12 h-12 rounded-full border-4 border-beige border-t-terracotta animate-spin"></div>
          <p class="text-xs text-stone-500 font-medium">Cargando catálogo floral...</p>
        </div>

        <!-- Products Grid with Slide Transitions -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <transition-group
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in absolute"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4"
          >
            <div 
              v-for="product in filteredProducts" 
              :key="product.id"
              class="w-full"
            >
              <ProductCard 
                :product="product"
                :whatsappNumber="whatsappNumber"
                @add-to-cart="addToCart"
                @view-details="openProductDetail"
              />
            </div>
          </transition-group>
        </div>

      </div>
    </section>

    <!-- How To Buy Guideline -->
    <HowToBuy />

    <!-- Trust Building Blocks -->
    <TrustSection />

    <!-- Footer Information -->
    <Footer />

    <!-- Side Cart Drawer Overlay -->
    <CartDrawer 
      :isOpen="isCartOpen" 
      :cartItems="cart"
      :whatsappNumber="whatsappNumber"
      @close="isCartOpen = false"
      @update-quantity="updateQuantity"
      @remove-item="removeItem"
      @clear-cart="clearCart"
    />

    <!-- Graphical Product Detail Modal -->
    <ProductDetailModal
      :isOpen="isDetailOpen"
      :product="selectedProductForDetail"
      :whatsappNumber="whatsappNumber"
      @close="isDetailOpen = false"
      @add-to-cart="addToCart"
    />

  </div>
</template>

<style>
/* Smooth filtering layout transition */
.grid {
  position: relative;
}
</style>
