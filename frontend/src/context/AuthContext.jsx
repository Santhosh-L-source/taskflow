import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase'

const AuthContext = createContext(null)

const FIREBASE_ERRORS = {
  'auth/email-already-in-use':  'This email is already registered.',
  'auth/invalid-email':          'Please enter a valid email address.',
  'auth/wrong-password':         'Invalid email or password.',
  'auth/user-not-found':         'Invalid email or password.',
  'auth/invalid-credential':     'Invalid email or password.',
  'auth/weak-password':          'Password should be at least 6 characters.',
  'auth/too-many-requests':      'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
}

export function parseFirebaseError(err) {
  return FIREBASE_ERRORS[err?.code] || err?.message || 'Something went wrong.'
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If Firebase isn't configured, skip auth listener
    if (!isFirebaseConfigured) {
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsub
  }, [])

  const signup = async (email, password, displayName) => {
    if (!isFirebaseConfigured) throw new Error('Firebase is not configured yet.')
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
    setUser({ ...cred.user, displayName })
    return cred.user
  }

  const login = async (email, password) => {
    if (!isFirebaseConfigured) throw new Error('Firebase is not configured yet.')
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
  }

  const logout = () => {
    if (!isFirebaseConfigured) return
    return signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isFirebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
