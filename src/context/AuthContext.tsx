import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateUserEmail: (newEmail: string, currentPassword?: string) => Promise<void>;
  updateUserPhone: (newPhone: string) => Promise<void>;
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
      if (res.user) {
        if (name) {
          await updateProfile(res.user, { displayName: name });
        }
        // Send email verification right after user registers
        await sendEmailVerification(res.user).catch((err) => {
          console.warn("Email verification send notice:", err);
        });

        // Asynchronously trigger Titan Mail Welcome Email
        fetch('/api/welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, displayName: name }),
        }).catch((err) => console.warn("Welcome email trigger notice:", err));
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error("No active user logged in.");
    }
  };

  const updateUserEmail = async (newEmail: string, currentPassword?: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No active user session.");

    // Re-authenticate if password is provided and user has password provider
    if (currentPassword && currentUser.email) {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
    }

    await updateEmail(currentUser, newEmail);
    await sendEmailVerification(currentUser).catch((e) => console.warn("Verification email error:", e));
    localStorage.setItem('assetdoctor_user_email', newEmail);
  };

  const updateUserPhone = async (newPhone: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No active user session.");
    localStorage.setItem('assetdoctor_user_phone', newPhone);
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
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        loginWithGoogle, 
        loginWithEmail, 
        signupWithEmail, 
        sendVerificationEmail,
        updateUserEmail,
        updateUserPhone,
        logout 
      }}
    >
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
