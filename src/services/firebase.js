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
import { 
  getStorage, 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

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
let storage
try {
  storage = getStorage(app)
} catch (e) {
  console.warn("Firebase Storage could not be initialized. Check bucket configuration.", e)
}

export { auth, db, storage }

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

// --- IMAGES STORAGE SERVICES ---

export const uploadImage = async (file, path = 'uploads') => {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized.')
  }
  const fileExtension = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`
  const fileRef = storageRef(storage, `${path}/${fileName}`)
  
  const snapshot = await uploadBytes(fileRef, file)
  return getDownloadURL(snapshot.ref)
}

export const deleteImage = async (fileUrl) => {
  if (!storage || !fileUrl) return
  try {
    // Only attempt delete if it is a storage URL
    if (fileUrl.includes('firebasestorage.googleapis.com')) {
      const fileRef = storageRef(storage, fileUrl)
      await deleteObject(fileRef)
    }
  } catch (error) {
    console.error('Error deleting image from Storage:', error)
  }
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
    let q = query(categoriesCol, orderBy('order', 'asc'))
    
    if (onlyActive) {
      q = query(categoriesCol, where('active', '==', true), orderBy('order', 'asc'))
    }
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
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
    let q = query(productsCol, orderBy('order', 'asc'))
    
    if (onlyActive) {
      q = query(productsCol, where('active', '==', true), orderBy('order', 'asc'))
    }
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
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
    whatsappNumber: '573000000000',
    siteName: 'Jean Rous Floristería'
  }, { merge: true })

  await batch.commit()
}
