"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { onAuthStateChanged, User, getRedirectResult } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    // Handle redirect result
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          toast.success("Successfully logged in with Google!")
          const token = await result.user.getIdToken();
          document.cookie = `firebaseIdToken=${token}; path=/; SameSite=Lax`;
          // The onAuthStateChanged listener will handle setting the user
        }
      })
      .catch((error) => {
        console.error("Error getting redirect result:", error)
        toast.error(error.message || "Google sign-in failed")
      })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}