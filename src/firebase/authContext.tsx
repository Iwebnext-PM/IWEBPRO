import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './config';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAsDemoAdmin: () => void;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  configuredCredentials: {
    email: string;
    password: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const CONFIGURED_ADMIN_CREDENTIALS = {
  email: 'text202@gmail.com',
  password: '2026',
};

const BOOTSTRAP_ADMIN_EMAILS = [
  'rituparno.tnts@gmail.com',
  'text202@gmail.com',
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [demoAdminActive, setDemoAdminActive] = useState<boolean>(() => {
    return localStorage.getItem('iwebpro_demo_admin') === 'true';
  });

  useEffect(() => {
    // Check local admin session first
    const localSession = localStorage.getItem('iwebpro_admin_session');
    if (localSession) {
      try {
        const parsed = JSON.parse(localSession);
        if (parsed && parsed.email) {
          setUser(parsed as unknown as User);
          setIsAdmin(true);
        }
      } catch {
        // invalid JSON
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check if user is admin via bootstrap email or firestore document
        if (currentUser.email && BOOTSTRAP_ADMIN_EMAILS.includes(currentUser.email.toLowerCase())) {
          setIsAdmin(true);
        } else {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
            setIsAdmin(adminDoc.exists());
          } catch {
            setIsAdmin(demoAdminActive);
          }
        }
      } else {
        const activeLocalSession = localStorage.getItem('iwebpro_admin_session');
        if (activeLocalSession) {
          try {
            const parsed = JSON.parse(activeLocalSession);
            if (parsed && parsed.email) {
              setUser(parsed as unknown as User);
              setIsAdmin(true);
            }
          } catch {
            setIsAdmin(demoAdminActive);
          }
        } else {
          setIsAdmin(demoAdminActive);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [demoAdminActive]);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user.email && BOOTSTRAP_ADMIN_EMAILS.includes(res.user.email.toLowerCase())) {
        setIsAdmin(true);
        // Ensure admin document exists
        try {
          await setDoc(doc(db, 'admins', res.user.uid), {
            uid: res.user.uid,
            email: res.user.email,
            role: 'super_admin',
            createdAt: new Date().toISOString(),
          }, { merge: true });
        } catch (e) {
          console.warn('Admin doc creation notice:', e);
        }
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setAuthError(err.message || 'Google sign in failed. Please check popup permissions.');
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = pass.trim();

    // 1. Direct validation for the user-configured Admin Credentials: text202@gmail.com / 2026
    if (
      trimmedEmail === CONFIGURED_ADMIN_CREDENTIALS.email.toLowerCase() &&
      trimmedPass === CONFIGURED_ADMIN_CREDENTIALS.password
    ) {
      const mockAdminUser: any = {
        uid: 'admin-text202',
        email: CONFIGURED_ADMIN_CREDENTIALS.email,
        displayName: 'Iwebpro Administrator',
        emailVerified: true,
      };

      setUser(mockAdminUser);
      setIsAdmin(true);
      localStorage.setItem('iwebpro_admin_session', JSON.stringify({
        uid: 'admin-text202',
        email: CONFIGURED_ADMIN_CREDENTIALS.email,
        displayName: 'Iwebpro Administrator',
      }));
      localStorage.setItem('iwebpro_demo_admin', 'true');

      // Attempt to ensure admin document in Firestore
      try {
        await setDoc(doc(db, 'admins', 'admin-text202'), {
          uid: 'admin-text202',
          email: CONFIGURED_ADMIN_CREDENTIALS.email,
          role: 'super_admin',
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch {
        // non-blocking
      }
      return;
    }

    // 2. Standard Firebase Auth Email/Password fallback
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error('Email sign-in error:', err);
      // Give human-friendly guidance if provider is not enabled in Firebase console yet
      if (err.code === 'auth/operation-not-allowed') {
        setAuthError(
          'Email/Password provider is not yet enabled in Firebase Console. You can log in using text202@gmail.com / 2026 or Google Sign-In.'
        );
      } else if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        setAuthError(
          'Invalid credentials. Please enter ID: text202@gmail.com and password: 2026 to access the admin panel.'
        );
      } else {
        setAuthError(err.message || 'Authentication error.');
      }
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      setAuthError(err.message || 'Registration error.');
      throw err;
    }
  };

  const sendPasswordReset = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setAuthError(err.message || 'Password reset error.');
      throw err;
    }
  };

  const loginAsDemoAdmin = () => {
    const adminUser: any = {
      uid: 'admin-text202',
      email: CONFIGURED_ADMIN_CREDENTIALS.email,
      displayName: 'Iwebpro Administrator',
      emailVerified: true,
    };
    setUser(adminUser);
    setDemoAdminActive(true);
    setIsAdmin(true);
    localStorage.setItem('iwebpro_admin_session', JSON.stringify({
      uid: 'admin-text202',
      email: CONFIGURED_ADMIN_CREDENTIALS.email,
      displayName: 'Iwebpro Administrator',
    }));
    localStorage.setItem('iwebpro_demo_admin', 'true');
    setAuthError(null);
  };

  const logout = async () => {
    setDemoAdminActive(false);
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem('iwebpro_admin_session');
    localStorage.removeItem('iwebpro_demo_admin');
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        logout,
        loginAsDemoAdmin,
        authError,
        setAuthError,
        configuredCredentials: CONFIGURED_ADMIN_CREDENTIALS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
