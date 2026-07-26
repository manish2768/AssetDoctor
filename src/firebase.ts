import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  type ConfirmationResult 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6X3yKH1LhQjRHE_JJaLCrv9ug9yrzPEs",
  authDomain: "assetdoctor-5fd25.firebaseapp.com",
  projectId: "assetdoctor-5fd25",
  storageBucket: "assetdoctor-5fd25.firebasestorage.app",
  messagingSenderId: "926559836985",
  appId: "1:926559836985:web:3c4a58b18615ad342b66e8"
};

// Firebase Initialize (Singleton pattern for HMR safety)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Services Export
export const auth = getAuth(app);

// Enforce Session Persistence in LocalStorage so user is NOT repeatedly logged out
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn("Firebase Auth Persistence setPersistence warning:", err);
});

export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Recaptcha Helper for Mobile OTP Authentication
export const setupRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    }
  });
};

export { signInWithPhoneNumber, type ConfirmationResult };
export default app;
