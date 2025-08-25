"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { onAuthStateChanged, User, getRedirectResult } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"

// We can augment the Firebase User type to include our custom claims if needed
// For now, we'll use the decoded token from our API as the user object
interface AuthContextType {
  user: any | null; // Using 'any' for now to represent the decoded token
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to verify session", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();

    // Listen for client-side auth state changes to handle sign-outs from other tabs.
    const unsubscribe = onAuthStateChanged(auth, (clientUser) => {
      if (!clientUser && user) {
        // User signed out on the client, sync the state by re-verifying
        // This handles the case where logoutUser() is called.
        verifySession();
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext)
}