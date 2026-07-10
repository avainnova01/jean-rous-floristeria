<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '../services/firebase'

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  error.value = ''
  
  // Validation
  if (!email.value.trim() || !password.value.trim()) {
    error.value = 'Por favor, ingresa tu correo y contraseña.'
    return
  }

  isLoading.value = true
  try {
    await loginUser(email.value, password.value)
    // Redirect to admin panel on success
    router.push('/admin')
  } catch (err) {
    console.error('Error logging in:', err.code, err.message)
    switch (err.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        error.value = 'Correo electrónico o contraseña incorrectos.'
        break
      case 'auth/invalid-email':
        error.value = 'El formato del correo electrónico no es válido.'
        break
      case 'auth/user-disabled':
        error.value = 'Este usuario ha sido deshabilitado.'
        break
      default:
        error.value = 'Ocurrió un error al intentar iniciar sesión. Inténtalo de nuevo.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-cream px-4 sm:px-6 lg:px-8 font-sans antialiased">
    <div class="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-[2.5rem] border border-beige shadow-lg">
      
      <!-- Header -->
      <div class="text-center">
        <h2 class="font-serif text-3xl font-bold text-stone-900">
          Jean Rous
        </h2>
        <p class="text-[10px] tracking-[0.2em] uppercase text-olive font-semibold mt-1">
          Floristería • Acceso Administrativo
        </p>
        <div class="w-12 h-[2px] bg-terracotta mx-auto mt-4 rounded-full"></div>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4 rounded-md">
          <!-- Email Field -->
          <div>
            <label for="email-address" class="block text-xs font-semibold text-stone-700">Correo Electrónico</label>
            <input 
              id="email-address" 
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              v-model="email"
              placeholder="admin@jeanrous.com"
              class="mt-1 block w-full px-4 py-3 border border-beige rounded-2xl text-sm bg-cream/30 focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta transition-colors"
            />
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-xs font-semibold text-stone-700">Contraseña</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autocomplete="current-password" 
              required 
              v-model="password"
              placeholder="••••••••"
              class="mt-1 block w-full px-4 py-3 border border-beige rounded-2xl text-sm bg-cream/30 focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta transition-colors"
            />
          </div>
        </div>

        <!-- Error Message -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed">
            {{ error }}
          </div>
        </transition>

        <!-- Submit Button -->
        <div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-xs font-bold uppercase tracking-wider rounded-full text-white bg-terracotta hover:bg-terracotta-dark focus:outline-none shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-4">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Ingresando...' : 'Iniciar Sesión' }}
          </button>
        </div>
      </form>

      <!-- Footer backlink -->
      <div class="text-center mt-6">
        <router-link to="/" class="text-xs text-stone-500 hover:text-terracotta font-medium transition-colors">
          ← Volver a la página principal
        </router-link>
      </div>

    </div>
  </div>
</template>
