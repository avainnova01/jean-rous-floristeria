import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AdminView from '../views/AdminView.vue'

// Helper to wait for Firebase Auth to initialize before proceeding
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject
    )
  })
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      guestOnly: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: {
      requiresAuth: true
    }
  },
  // Catch all redirecting to Home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Auto scroll to top on route change
  scrollBehavior() {
    return { top: 0 }
  }
})

// Route guard configuration
router.beforeEach(async (to, from, next) => {
  const currentUser = await getCurrentUser()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const guestOnly = to.matched.some(record => record.meta.guestOnly)

  if (requiresAuth && !currentUser) {
    // If route requires auth and user is not logged in, redirect to login
    next('/login')
  } else if (guestOnly && currentUser) {
    // If user is already logged in and tries to go to login, redirect to admin
    next('/admin')
  } else {
    next()
  }
})

export default router
