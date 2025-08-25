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

    // First, handle the potential redirect from Google Sign-In
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          // A user has just signed in via redirect.
          toast.success("Successfully logged in with Google!");
          const token = await result.user.getIdToken();
          // Create the server-side session
          const response = await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });

          if (!response.ok) {
            throw new Error('Failed to create server session after redirect.');
          }

          // Now that the session is created, verify it to get the user state
          await verifySession();
        } else {
          // No redirect result, just verify the existing session
          await verifySession();
        }
      })
      .catch((error) => {
        console.error("Error getting redirect result:", error);
        toast.error(error.message || "Google sign-in failed");
        verifySession(); // Still try to verify session even if redirect fails
      });

    // Optional: Listen for client-side auth state changes to handle token expiry or sign-outs from other tabs.
    const unsubscribe = onAuthStateChanged(auth, (clientUser) => {
      if (!clientUser && user) {
        // User signed out on the client, sync the state
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext)
}