import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Web app's Firebase configuration for project: kisanconnect-2267e
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: 'kisanconnect-2267e.firebaseapp.com',
  projectId: 'kisanconnect-2267e',
  storageBucket: 'kisanconnect-2267e.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { app, auth }
export default app
