<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  logoutUser, 
  fetchCategories, 
  saveCategory, 
  removeCategory, 
  fetchProducts, 
  saveProduct, 
  removeProduct, 
  getGeneralSettings, 
  saveGeneralSettings, 
  seedDatabase,
  uploadImage,
  auth
} from '../services/firebase'

// Local fallbacks data for seeding
import { CATEGORIES as LOCAL_CATEGORIES, PRODUCTS as LOCAL_PRODUCTS } from '../data/products'

const router = useRouter()
const activeTab = ref('products') // 'products', 'categories', 'settings'

// Data States
const categories = ref([])
const products = ref([])
const whatsappNumber = ref('573000000000')
const siteName = ref('Jean Rous Floristería')

// UI States
const isLoading = ref(true)
const isSubmitting = ref(false)
const notification = ref({ show: false, message: '', type: 'success' })

// Search & Filter
const productSearch = ref('')
const selectedCategoryFilter = ref('todos')

// Modals States
const isCategoryModalOpen = ref(false)
const isProductModalOpen = ref(false)
const currentCategoryEdit = ref(null)
const currentProductEdit = ref(null)

// Forms Data
const categoryForm = ref({
  id: '',
  name: '',
  description: '',
  image: '',
  active: true,
  order: 0
})

const productForm = ref({
  id: '',
  name: '',
  description: '',
  price: 0,
  image: '',
  category: '',
  active: true,
  order: 0
})

// File Upload ref values
const categoryImageFile = ref(null)
const productImageFile = ref(null)
const categoryImagePreview = ref('')
const productImagePreview = ref('')

// Load database on start
const withTimeout = (promise, ms = 10000) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), ms)
  )
  return Promise.race([promise, timeout])
}

const loadData = async () => {
  isLoading.value = true
  try {
    const [dbCats, dbProds, settings] = await withTimeout(
      Promise.all([fetchCategories(), fetchProducts(), getGeneralSettings()]),
      10000
    )

    categories.value = dbCats || []
    products.value = dbProds || []

    if (settings) {
      whatsappNumber.value = settings.whatsappNumber || '573000000000'
      siteName.value = settings.siteName || 'Jean Rous Floristería'
    }
  } catch (error) {
    const isTimeout = error.message === 'timeout'
    const msg = isTimeout
      ? '⚠️ No se pudo conectar con Firestore. Asegúrate de haber creado la base de datos en la consola de Firebase y de haber publicado las reglas correctas.'
      : 'Error al cargar datos desde Firebase. Revisa la consola del navegador para más detalles.'
    console.error('Error loading admin data:', error)
    showNotification(msg, 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

// Notification helper
const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 4000)
}

// Log out handler
const handleLogout = async () => {
  try {
    await logoutUser()
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Seeding trigger
const handleSeedDatabase = async () => {
  if (!confirm('¿Estás seguro de que deseas sembrar la base de datos? Esto creará o sobrescribirá las categorías y productos existentes con los datos iniciales.')) {
    return
  }
  
  isSubmitting.value = true
  try {
    await seedDatabase(LOCAL_CATEGORIES, LOCAL_PRODUCTS)
    showNotification('Base de datos sembrada con éxito. Datos cargados en Firestore.')
    await loadData()
  } catch (error) {
    console.error('Seeding error:', error)
    showNotification('Ocurrió un error al sembrar la base de datos.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Settings save handler
const handleSaveSettings = async () => {
  isSubmitting.value = true
  try {
    await saveGeneralSettings({
      whatsappNumber: whatsappNumber.value.trim(),
      siteName: siteName.value.trim()
    })
    showNotification('Configuración general actualizada.')
  } catch (error) {
    console.error('Settings save error:', error)
    showNotification('Error al guardar configuración.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// File Input helpers
const onCategoryFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    categoryImageFile.value = file
    categoryImagePreview.value = URL.createObjectURL(file)
  }
}

const onProductFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    productImageFile.value = file
    productImagePreview.value = URL.createObjectURL(file)
  }
}

// --- CATEGORIES MODAL & SUBMIT ---

const openCategoryModal = (cat = null) => {
  currentCategoryEdit.value = cat
  categoryImageFile.value = null
  categoryImagePreview.value = ''
  
  if (cat) {
    categoryForm.value = { ...cat }
  } else {
    categoryForm.value = {
      id: '',
      name: '',
      description: '',
      image: '',
      active: true,
      order: categories.value.length ? Math.max(...categories.value.map(c => c.order || 0)) + 10 : 0
    }
  }
  isCategoryModalOpen.value = true
}

const closeCategoryModal = () => {
  isCategoryModalOpen.value = false
  currentCategoryEdit.value = null
}

const handleSubmitCategory = async () => {
  const data = { ...categoryForm.value }
  
  // Validation
  if (!data.id.trim() || !data.name.trim() || !data.description.trim()) {
    showNotification('Completa los campos obligatorios.', 'error')
    return
  }

  // ID must be lowercase alphanumeric for routing safety
  data.id = data.id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '')

  isSubmitting.value = true
  try {
    // Check if uploading image
    if (categoryImageFile.value) {
      const url = await uploadImage(categoryImageFile.value, 'categories')
      data.image = url
    }

    await saveCategory(data.id, data)
    showNotification(currentCategoryEdit.value ? 'Categoría actualizada.' : 'Categoría creada con éxito.')
    closeCategoryModal()
    await loadData()
  } catch (error) {
    console.error('Error saving category:', error)
    showNotification('Error al guardar la categoría.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleDeleteCategory = async (id) => {
  if (!confirm(`¿Estás seguro de que deseas eliminar la categoría "${id}"? Los productos asociados a ella no se eliminarán pero quedarán huérfanos.`)) {
    return
  }

  try {
    await removeCategory(id)
    showNotification('Categoría eliminada con éxito.')
    await loadData()
  } catch (error) {
    console.error('Error deleting category:', error)
    showNotification('Error al eliminar la categoría.', 'error')
  }
}

const toggleCategoryActive = async (cat) => {
  try {
    await saveCategory(cat.id, { active: !cat.active })
    await loadData()
    showNotification(cat.active ? 'Categoría desactivada.' : 'Categoría activada con éxito.')
  } catch (error) {
    console.error('Error toggling active state:', error)
  }
}

// --- PRODUCTS MODAL & SUBMIT ---

const openProductModal = (prod = null) => {
  currentProductEdit.value = prod
  productImageFile.value = null
  productImagePreview.value = ''
  
  if (prod) {
    productForm.value = { ...prod }
  } else {
    productForm.value = {
      id: '',
      name: '',
      description: '',
      price: 0,
      image: '',
      category: categories.value.length ? categories.value[0].id : '',
      active: true,
      order: products.value.length ? Math.max(...products.value.map(p => p.order || 0)) + 10 : 0
    }
  }
  isProductModalOpen.value = true
}

const closeProductModal = () => {
  isProductModalOpen.value = false
  currentProductEdit.value = null
}

const handleSubmitProduct = async () => {
  const data = { ...productForm.value }

  // Validation
  if (!data.name.trim() || !data.description.trim() || data.price <= 0 || !data.category) {
    showNotification('Por favor, completa los campos requeridos y asigna un precio mayor a 0.', 'error')
    return
  }

  isSubmitting.value = true
  try {
    // Check if uploading image
    if (productImageFile.value) {
      const url = await uploadImage(productImageFile.value, 'products')
      data.image = url
    }

    await saveProduct(currentProductEdit.value ? data.id : null, data)
    showNotification(currentProductEdit.value ? 'Producto actualizado.' : 'Producto creado con éxito.')
    closeProductModal()
    await loadData()
  } catch (error) {
    console.error('Error saving product:', error)
    showNotification('Error al guardar el producto.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleDeleteProduct = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este producto de forma permanente?')) {
    return
  }

  try {
    await removeProduct(id)
    showNotification('Producto eliminado.')
    await loadData()
  } catch (error) {
    console.error('Error deleting product:', error)
    showNotification('Error al eliminar el producto.', 'error')
  }
}

const toggleProductActive = async (prod) => {
  try {
    await saveProduct(prod.id, { active: !prod.active })
    await loadData()
    showNotification(prod.active ? 'Producto ocultado en catálogo.' : 'Producto activado en catálogo.')
  } catch (error) {
    console.error('Error toggling product active state:', error)
  }
}

// --- FILTERED PRODUCTS COMPUTED ---

const filteredProducts = computed(() => {
  let list = products.value
  
  // Category Filter
  if (selectedCategoryFilter.value !== 'todos') {
    list = list.filter(p => p.category === selectedCategoryFilter.value)
  }

  // Name Search
  if (productSearch.value.trim()) {
    const search = productSearch.value.toLowerCase().trim()
    list = list.filter(p => p.name.toLowerCase().includes(search))
  }

  return list
})
</script>

<template>
  <div class="min-h-screen bg-cream font-sans antialiased text-stone-800 flex flex-col">
    
    <!-- Top Sticky Header -->
    <header class="sticky top-0 z-40 bg-white border-b border-beige shadow-sm px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="font-serif text-lg font-bold text-terracotta">Jean Rous</span>
        <span class="text-[10px] tracking-wider uppercase bg-peach-light text-terracotta border border-peach/50 px-2.5 py-0.5 rounded-full font-bold">Admin</span>
      </div>
      
      <div class="flex items-center gap-4">
        <span class="hidden sm:inline text-xs text-stone-500 font-medium font-mono">
          {{ auth.currentUser?.email }}
        </span>
        <button 
          @click="handleLogout"
          class="px-4 py-2 border border-beige hover:border-peach rounded-full text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-terracotta hover:bg-cream/40 transition-all cursor-pointer focus:outline-none"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>

    <!-- Main Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      <!-- Notification Bar -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div 
          v-if="notification.show" 
          :class="[
            'px-6 py-4 rounded-3xl border text-xs font-semibold leading-relaxed shadow-sm flex items-center gap-2',
            notification.type === 'error' 
              ? 'bg-red-50 border-red-200 text-red-600' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          ]"
        >
          <svg v-if="notification.type !== 'error'" class="w-4 h-4 text-emerald-500 fill-current" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
          </svg>
          {{ notification.message }}
        </div>
      </transition>

      <!-- Navigation Tabs -->
      <div class="border-b border-beige flex space-x-6">
        <button 
          @click="activeTab = 'products'"
          :class="[
            'pb-4 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer focus:outline-none',
            activeTab === 'products' 
              ? 'text-terracotta font-extrabold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-terracotta' 
              : 'text-stone-500 hover:text-stone-800'
          ]"
        >
          Productos
        </button>
        <button 
          @click="activeTab = 'categories'"
          :class="[
            'pb-4 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer focus:outline-none',
            activeTab === 'categories' 
              ? 'text-terracotta font-extrabold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-terracotta' 
              : 'text-stone-500 hover:text-stone-800'
          ]"
        >
          Categorías
        </button>
        <button 
          @click="activeTab = 'settings'"
          :class="[
            'pb-4 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer focus:outline-none',
            activeTab === 'settings' 
              ? 'text-terracotta font-extrabold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-terracotta' 
              : 'text-stone-500 hover:text-stone-800'
          ]"
        >
          Configuración
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 space-y-4">
        <div class="w-10 h-10 rounded-full border-4 border-beige border-t-terracotta animate-spin"></div>
        <p class="text-xs text-stone-500 font-medium">Cargando base de datos...</p>
      </div>

      <!-- TAB: PRODUCTS -->
      <div v-else-if="activeTab === 'products'" class="space-y-4 animate-fade-in">
        
        <!-- Controls row -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div class="flex flex-col sm:flex-row gap-2 flex-1 max-w-2xl">
            <!-- Search field -->
            <input 
              v-model="productSearch"
              type="text" 
              placeholder="Buscar producto por nombre..."
              class="px-4 py-2 border border-beige rounded-2xl text-xs bg-white focus:outline-none focus:border-terracotta flex-1"
            />
            <!-- Filter by category -->
            <select 
              v-model="selectedCategoryFilter"
              class="px-4 py-2 border border-beige rounded-2xl text-xs bg-white focus:outline-none focus:border-terracotta w-full sm:w-48"
            >
              <option value="todos">Todas las categorías</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          
          <button 
            @click="openProductModal()"
            class="px-6 py-2.5 bg-terracotta hover:bg-terracotta-dark text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
          </button>
        </div>

        <!-- Products List Card -->
        <div class="bg-white border border-beige rounded-[2rem] overflow-hidden shadow-xs">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-beige/50 text-left">
              <thead class="bg-cream/40 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th scope="col" class="px-6 py-4">Detalle</th>
                  <th scope="col" class="px-6 py-4">Categoría</th>
                  <th scope="col" class="px-6 py-4">Precio</th>
                  <th scope="col" class="px-6 py-4">Orden</th>
                  <th scope="col" class="px-6 py-4">Estado</th>
                  <th scope="col" class="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-beige/40 text-xs text-stone-700">
                <tr v-if="filteredProducts.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center text-stone-400">
                    No se encontraron productos registrados.
                  </td>
                </tr>
                <tr v-for="prod in filteredProducts" :key="prod.id" class="hover:bg-cream/20 transition-colors">
                  <td class="px-6 py-4 flex items-center gap-3">
                    <img 
                      :src="prod.image || 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=120&q=80'" 
                      :alt="prod.name"
                      class="w-12 h-12 object-cover rounded-xl border border-beige flex-shrink-0"
                    />
                    <div class="min-w-0">
                      <h4 class="font-semibold text-stone-900 truncate max-w-[200px]">{{ prod.name }}</h4>
                      <p class="text-[10px] text-stone-400 truncate max-w-[280px] mt-0.5">{{ prod.description }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-peach-light text-terracotta border border-peach/20 uppercase">
                      {{ categories.find(c => c.id === prod.category)?.name || prod.category }}
                    </span>
                  </td>
                  <td class="px-6 py-4 font-serif font-bold text-terracotta text-sm">
                    ${{ new Intl.NumberFormat('es-CO').format(prod.price) }}
                  </td>
                  <td class="px-6 py-4 font-mono font-medium text-stone-500">
                    {{ prod.order }}
                  </td>
                  <td class="px-6 py-4">
                    <button 
                      @click="toggleProductActive(prod)"
                      :class="[
                        'px-2.5 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer transition-colors',
                        prod.active 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100' 
                          : 'bg-stone-50 border-stone-200 text-stone-400 hover:bg-stone-100'
                      ]"
                    >
                      {{ prod.active ? 'Activo' : 'Inactivo' }}
                    </button>
                  </td>
                  <td class="px-6 py-4 text-right space-x-1">
                    <button 
                      @click="openProductModal(prod)"
                      class="p-2 border border-beige hover:border-peach hover:bg-peach/10 text-stone-600 hover:text-terracotta rounded-xl transition-all cursor-pointer focus:outline-none inline-flex items-center justify-center"
                      title="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      @click="handleDeleteProduct(prod.id)"
                      class="p-2 border border-beige hover:border-red-200 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-xl transition-all cursor-pointer focus:outline-none inline-flex items-center justify-center"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- TAB: CATEGORIES -->
      <div v-else-if="activeTab === 'categories'" class="space-y-4 animate-fade-in">
        
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase text-olive tracking-wider">Categorías Registradas</h3>
          <button 
            @click="openCategoryModal()"
            class="px-6 py-2.5 bg-terracotta hover:bg-terracotta-dark text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Categoría
          </button>
        </div>

        <div class="bg-white border border-beige rounded-[2rem] overflow-hidden shadow-xs">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-beige/50 text-left">
              <thead class="bg-cream/40 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th scope="col" class="px-6 py-4">Categoría</th>
                  <th scope="col" class="px-6 py-4">ID / Ruta</th>
                  <th scope="col" class="px-6 py-4">Orden</th>
                  <th scope="col" class="px-6 py-4">Estado</th>
                  <th scope="col" class="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-beige/40 text-xs text-stone-700">
                <tr v-if="categories.length === 0">
                  <td colspan="5" class="px-6 py-12 text-center text-stone-400">
                    No se encontraron categorías registradas.
                  </td>
                </tr>
                <tr v-for="cat in categories" :key="cat.id" class="hover:bg-cream/20 transition-colors">
                  <td class="px-6 py-4 flex items-center gap-3">
                    <img 
                      :src="cat.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=120&q=80'" 
                      :alt="cat.name"
                      class="w-12 h-12 object-cover rounded-xl border border-beige flex-shrink-0"
                    />
                    <div class="min-w-0">
                      <h4 class="font-semibold text-stone-900 truncate max-w-[200px]">{{ cat.name }}</h4>
                      <p class="text-[10px] text-stone-400 truncate max-w-[320px] mt-0.5">{{ cat.description }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 font-mono text-stone-500">
                    {{ cat.id }}
                  </td>
                  <td class="px-6 py-4 font-mono font-medium text-stone-500">
                    {{ cat.order }}
                  </td>
                  <td class="px-6 py-4">
                    <button 
                      @click="toggleCategoryActive(cat)"
                      :class="[
                        'px-2.5 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer transition-colors',
                        cat.active 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100' 
                          : 'bg-stone-50 border-stone-200 text-stone-400 hover:bg-stone-100'
                      ]"
                    >
                      {{ cat.active ? 'Activa' : 'Inactiva' }}
                    </button>
                  </td>
                  <td class="px-6 py-4 text-right space-x-1">
                    <button 
                      @click="openCategoryModal(cat)"
                      class="p-2 border border-beige hover:border-peach hover:bg-peach/10 text-stone-600 hover:text-terracotta rounded-xl transition-all cursor-pointer focus:outline-none inline-flex items-center justify-center"
                      title="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      @click="handleDeleteCategory(cat.id)"
                      class="p-2 border border-beige hover:border-red-200 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-xl transition-all cursor-pointer focus:outline-none inline-flex items-center justify-center"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- TAB: SETTINGS -->
      <div v-else-if="activeTab === 'settings'" class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
        
        <!-- General configs card -->
        <div class="bg-white border border-beige rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 class="font-serif text-lg font-bold text-stone-900">Configuración General</h3>
            <div class="w-8 h-[2px] bg-terracotta mt-2 rounded-full"></div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label for="site-name" class="block text-xs font-semibold text-stone-700">Nombre del Sitio</label>
              <input 
                id="site-name"
                v-model="siteName"
                type="text" 
                class="mt-1 block w-full px-4 py-2.5 border border-beige rounded-2xl text-xs bg-cream/20 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-colors"
              />
            </div>

            <div>
              <label for="whatsapp" class="block text-xs font-semibold text-stone-700">Número de WhatsApp (con código de país)</label>
              <input 
                id="whatsapp"
                v-model="whatsappNumber"
                type="text" 
                placeholder="Ej: 573000000000"
                class="mt-1 block w-full px-4 py-2.5 border border-beige rounded-2xl text-xs bg-cream/20 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-colors font-mono"
              />
              <p class="text-[10px] text-stone-400 mt-1">Escribe el código del país seguido del número telefónico sin espacios ni caracteres especiales.</p>
            </div>
          </div>

          <button 
            @click="handleSaveSettings"
            :disabled="isSubmitting"
            class="px-6 py-3 bg-terracotta hover:bg-terracotta-dark text-white font-bold uppercase tracking-wider text-xs rounded-full shadow-sm hover:shadow transition-all cursor-pointer focus:outline-none"
          >
            Guardar Configuración
          </button>
        </div>

        <!-- Seeder and Tools Card -->
        <div class="bg-white border border-beige rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 class="font-serif text-lg font-bold text-stone-900">Mantenimiento de Base de Datos</h3>
            <div class="w-8 h-[2px] bg-terracotta mt-2 rounded-full"></div>
            <p class="text-xs text-stone-500 font-light mt-4 leading-relaxed">
              Utiliza esta herramienta para rellenar la base de datos de Cloud Firestore por primera vez o reestablecer la información original del catálogo.
            </p>
            <div class="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-2xl text-xs mt-4 leading-relaxed">
              <strong>Advertencia:</strong> La carga sembrará 6 colecciones/categorías y más de 40 productos por defecto. Sobrescribirá cualquier categoría o producto que compartan la misma clave identificadora.
            </div>
          </div>

          <button 
            @click="handleSeedDatabase"
            :disabled="isSubmitting"
            class="w-full flex items-center justify-center gap-2 py-3 px-6 border border-terracotta text-terracotta hover:bg-terracotta hover:text-white rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-300 disabled:opacity-50 cursor-pointer focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 fill-current" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            Importar Catálogo Inicial (Seeder)
          </button>
        </div>

      </div>

    </main>

    <!-- FOOTER LINK BACK TO STORE -->
    <footer class="bg-beige/30 py-6 border-t border-beige/60 text-center text-xs text-stone-500 font-medium font-sans">
      <router-link to="/" class="hover:text-terracotta transition-colors">
        ← Volver a la página principal de la tienda
      </router-link>
    </footer>

    <!-- MODAL: ADD / EDIT CATEGORY -->
    <div v-show="isCategoryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs overflow-y-auto">
      <div class="bg-white rounded-[2.5rem] border border-beige shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-beige/60 pb-3">
          <h3 class="font-serif text-xl font-bold text-stone-900">
            {{ currentCategoryEdit ? 'Editar Categoría' : 'Nueva Categoría' }}
          </h3>
          <button @click="closeCategoryModal" class="text-stone-400 hover:text-terracotta transition-colors focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmitCategory" class="space-y-4 text-xs font-semibold text-stone-700">
          <div>
            <label class="block">Identificador Único (ID / Ruta en url) *</label>
            <input 
              v-model="categoryForm.id"
              :disabled="!!currentCategoryEdit"
              type="text" 
              placeholder="ej: novias, amor, cumpleanos"
              required
              class="mt-1 block w-full px-4 py-2.5 border border-beige rounded-2xl bg-cream/10 focus:outline-none focus:border-terracotta disabled:opacity-60"
            />
            <p v-if="!currentCategoryEdit" class="text-[10px] text-stone-400 mt-1 font-normal">Debe ser una palabra en minúsculas sin espacios (se usará como identificador en URL).</p>
          </div>

          <div>
            <label class="block">Nombre de la Categoría *</label>
            <input 
              v-model="categoryForm.name"
              type="text" 
              placeholder="ej: Amor y Amistad"
              required
              class="mt-1 block w-full px-4 py-2.5 border border-beige rounded-2xl bg-cream/10 focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label class="block">Descripción *</label>
            <textarea 
              v-model="categoryForm.description"
              rows="3" 
              placeholder="Breve descripción de los arreglos de esta colección..."
              required
              class="mt-1 block w-full px-4 py-2.5 border border-beige rounded-2xl bg-cream/10 focus:outline-none focus:border-terracotta resize-none"
            ></textarea>
          </div>

          <!-- Image upload and preview -->
          <div>
            <label class="block">Imagen de la Categoría</label>
            <div class="mt-2 flex items-center gap-4">
              <img 
                :src="categoryImagePreview || categoryForm.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=120&q=80'" 
                class="w-16 h-16 object-cover rounded-xl border border-beige flex-shrink-0"
              />
              <div class="flex-grow space-y-2">
                <input 
                  type="file" 
                  accept="image/*"
                  @change="onCategoryFileChange"
                  class="text-xs text-stone-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-peach-light file:text-terracotta hover:file:bg-peach cursor-pointer"
                />
                <input 
                  v-model="categoryForm.image"
                  type="text" 
                  placeholder="O ingresa una URL directa de imagen..."
                  class="block w-full px-4 py-2 border border-beige rounded-2xl bg-cream/10 focus:outline-none focus:border-terracotta font-normal text-[11px]"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label class="block">Posición / Orden de ordenamiento</label>
              <input 
                v-model.number="categoryForm.order"
                type="number" 
                class="mt-1 block w-full px-4 py-2.5 border border-beige rounded-2xl bg-cream/10 focus:outline-none focus:border-terracotta"
              />
            </div>
            <div class="flex items-center gap-2 pt-5 select-none">
              <input 
                id="cat-active" 
                v-model="categoryForm.active"
                type="checkbox" 
                class="h-4 w-4 text-terracotta focus:ring-terracotta border-beige rounded"
              />
              <label for="cat-active" class="text-xs font-semibold cursor-pointer">Categoría Activa</label>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-beige/60">
            <button 
              type="button" 
              @click="closeCategoryModal"
              class="px-5 py-2.5 border border-beige hover:border-peach rounded-full text-stone-500 hover:text-terracotta text-xs font-bold uppercase transition-colors cursor-pointer focus:outline-none"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="px-6 py-2.5 bg-terracotta hover:bg-terracotta-dark text-white rounded-full text-xs font-bold uppercase shadow-sm transition-all cursor-pointer focus:outline-none disabled:opacity-50"
            >
              {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: ADD / EDIT PRODUCT -->
    <div v-show="isProductModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs overflow-y-auto">
      <div class="bg-white rounded-[2.5rem] border border-beige shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-beige/60 pb-3">
          <h3 class="font-serif text-xl font-bold text-stone-900">
            {{ currentProductEdit ? 'Editar Producto' : 'Nuevo Producto' }}
          </h3>
          <button @click="closeProductModal" class="text-stone-400 hover:text-terracotta transition-colors focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmitProduct" class="space-y-4 text-xs font-semibold text-stone-700">
          <div>
            <label class="block">Nombre del Producto o Arreglo *</label>
            <input 
              v-model="productForm.name"
              type="text" 
              placeholder="ej: Ramo de Novia Silvestre"
              required
              class="mt-1 block w-full px-4 py-2.5 border border-beige rounded-2xl bg-cream/10 focus:outline-none focus:border-terracotta"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block">Categoría *</label>
              <select 
                v-model="productForm.category"
                required
                class="mt-1 block w-full px-4 py-2.5 border border-beige rounded-2xl bg-cream/10 focus:outline-none focus:border-terracotta"
              >
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block">Precio (COP) *</label>
              <input 
                v-model.number="productForm.price"
                type="number" 
                placeholder="ej: 280000"
                required
                class="mt-1 block w-full px-4 py-2.5 border border-beige rounded-2xl bg-cream/10 focus:outline-none focus:border-terracotta font-mono font-semibold"
              />
            </div>
          </div>

          <div>
            <label class="block">Descripción *</label>
            <textarea 
              v-model="productForm.description"
              rows="3" 
              placeholder="Detalles sobre las flores, follaje, envoltura, y colores..."
              required
              class="mt-1 block w-full px-4 py-2.5 border border-beige rounded-2xl bg-cream/10 focus:outline-none focus:border-terracotta resize-none"
            ></textarea>
          </div>

          <!-- Image upload and preview -->
          <div>
            <label class="block">Imagen del Producto</label>
            <div class="mt-2 flex items-center gap-4">
              <img 
                :src="productImagePreview || productForm.image || 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=120&q=80'" 
                class="w-16 h-16 object-cover rounded-xl border border-beige flex-shrink-0"
              />
              <div class="flex-grow space-y-2">
                <input 
                  type="file" 
                  accept="image/*"
                  @change="onProductFileChange"
                  class="text-xs text-stone-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-peach-light file:text-terracotta hover:file:bg-peach cursor-pointer"
                />
                <input 
                  v-model="productForm.image"
                  type="text" 
                  placeholder="O ingresa una URL directa de imagen..."
                  class="block w-full px-4 py-2 border border-beige rounded-2xl bg-cream/10 focus:outline-none focus:border-terracotta font-normal text-[11px]"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label class="block">Orden de prioridad</label>
              <input 
                v-model.number="productForm.order"
                type="number" 
                class="mt-1 block w-full px-4 py-2.5 border border-beige rounded-2xl bg-cream/10 focus:outline-none focus:border-terracotta"
              />
            </div>
            <div class="flex items-center gap-2 pt-5 select-none">
              <input 
                id="prod-active" 
                v-model="productForm.active"
                type="checkbox" 
                class="h-4 w-4 text-terracotta focus:ring-terracotta border-beige rounded"
              />
              <label for="prod-active" class="text-xs font-semibold cursor-pointer">Mostrar en tienda (Activo)</label>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-beige/60">
            <button 
              type="button" 
              @click="closeProductModal"
              class="px-5 py-2.5 border border-beige hover:border-peach rounded-full text-stone-500 hover:text-terracotta text-xs font-bold uppercase transition-colors cursor-pointer focus:outline-none"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="px-6 py-2.5 bg-terracotta hover:bg-terracotta-dark text-white rounded-full text-xs font-bold uppercase shadow-sm transition-all cursor-pointer focus:outline-none disabled:opacity-50"
            >
              {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Keyframe transitions */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
