import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase'

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
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsub
  }, [])

  const signup = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
    // Refresh user so displayName is available immediately
    setUser({ ...cred.user, displayName })
    return cred.user
  }

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
