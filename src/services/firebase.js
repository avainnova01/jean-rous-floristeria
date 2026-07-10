import { initializeApp, getApps, getApp } from 'firebase/app'
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  writeBatch
} from 'firebase/firestore'
// Firebase Storage is not used — images are hosted via imgbb (free)

// Firebase config from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }

// --- AUTHENTICATION SERVICES ---

export const loginUser = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const logoutUser = async () => {
  return signOut(auth)
}

export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback)
}

// --- IMAGES: Upload to imgbb (free, no Firebase Storage needed) ---
// Get your free API key at: https://api.imgbb.com/
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || ''

export const uploadImage = async (file) => {
  if (!IMGBB_API_KEY) {
    throw new Error('Falta la API key de imgbb. Agrega VITE_IMGBB_API_KEY en tu archivo .env')
  }

  // Convert file to base64
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1]) // strip "data:image/...;base64,"
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const formData = new FormData()
  formData.append('key', IMGBB_API_KEY)
  formData.append('image', base64)

  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData
  })

  const result = await response.json()

  if (!result.success) {
    throw new Error(result.error?.message || 'Error al subir la imagen a imgbb')
  }

  return result.data.url // direct image URL
}

// --- GENERAL SETTINGS SERVICES ---

export const getGeneralSettings = async () => {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'general'))
    if (settingsDoc.exists()) {
      return settingsDoc.data()
    }
    return null
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}

export const saveGeneralSettings = async (settings) => {
  await setDoc(doc(db, 'settings', 'general'), settings, { merge: true })
}

// --- CATEGORIES CRUD SERVICES ---

export const fetchCategories = async (onlyActive = false) => {
  try {
    const categoriesCol = collection(db, 'categories')
    // Use simple orderBy to avoid needing a composite index
    const q = query(categoriesCol, orderBy('order', 'asc'))
    const snapshot = await getDocs(q)
    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    // Filter active client-side if requested
    if (onlyActive) {
      results = results.filter(cat => cat.active !== false)
    }
    return results
  } catch (error) {
    console.error('Error fetching categories from Firestore:', error)
    throw error
  }
}

export const saveCategory = async (id, categoryData) => {
  const categoryRef = doc(db, 'categories', id)
  await setDoc(categoryRef, {
    ...categoryData,
    updatedAt: new Date().toISOString()
  }, { merge: true })
}

export const removeCategory = async (id) => {
  await deleteDoc(doc(db, 'categories', id))
}

// --- PRODUCTS CRUD SERVICES ---

export const fetchProducts = async (onlyActive = false) => {
  try {
    const productsCol = collection(db, 'products')
    // Use simple orderBy to avoid needing a composite index
    const q = query(productsCol, orderBy('order', 'asc'))
    const snapshot = await getDocs(q)
    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    // Filter active client-side if requested
    if (onlyActive) {
      results = results.filter(prod => prod.active !== false)
    }
    return results
  } catch (error) {
    console.error('Error fetching products from Firestore:', error)
    throw error
  }
}

export const saveProduct = async (id, productData) => {
  const productRef = id ? doc(db, 'products', id) : doc(collection(db, 'products'))
  const data = {
    ...productData,
    updatedAt: new Date().toISOString()
  }
  // If it's a new product, generate a matching id field inside the data
  if (!id) {
    data.id = productRef.id
  }
  await setDoc(productRef, data, { merge: true })
  return productRef.id
}

export const removeProduct = async (id) => {
  await deleteDoc(doc(db, 'products', id))
}

// --- DATABASE SEEDER ---

export const seedDatabase = async (categories, products) => {
  const batch = writeBatch(db)
  
  // 1. Seed Categories
  categories.forEach((cat, index) => {
    const catRef = doc(db, 'categories', cat.id)
    batch.set(catRef, {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      image: cat.image,
      active: true,
      order: index * 10
    })
  })

  // 2. Seed Products
  products.forEach((prod, index) => {
    const prodRef = doc(db, 'products', prod.id)
    batch.set(prodRef, {
      id: prod.id,
      name: prod.name,
      description: prod.description,
      price: prod.price,
      image: prod.image,
      category: prod.category,
      active: true,
      order: index * 10
    })
  })

  // 3. Seed general settings
  const settingsRef = doc(db, 'settings', 'general')
  batch.set(settingsRef, {
    whatsappNumber: '573173499781',
    siteName: 'Jean Rous Floristería'
  }, { merge: true })

  await batch.commit()
}
