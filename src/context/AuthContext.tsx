import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        localStorage.setItem('assetdoctor_is_logged_in', 'true');
        if (currentUser.email) localStorage.setItem('assetdoctor_user_email', currentUser.email);
        if (currentUser.displayName) localStorage.setItem('assetdoctor_user_name', currentUser.displayName);
        if (currentUser.phoneNumber) localStorage.setItem('assetdoctor_user_phone', currentUser.phoneNumber);
      } else {
        localStorage.removeItem('assetdoctor_is_logged_in');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error("Email login error:", error);
      throw error;
    }
  };

  const signupWithEmail = async (name: string, email: string, pass: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user && name) {
        await updateProfile(res.user, { displayName: name });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('assetdoctor_is_logged_in');
    } catch (error: any) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, signupWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
