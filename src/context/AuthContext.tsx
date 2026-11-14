'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

const ADMIN_EMAIL = 'jiyulain@gmail.com';

const setAdminSubdomainCookie = (enabled: boolean) => {
  if (typeof document === 'undefined') return;
  if (enabled) {
    document.cookie = 'sinabro_admin=1; domain=.ws.ai.kr; path=/; max-age=31536000; SameSite=Lax';
    document.cookie = 'sinabro_admin=1; path=/; max-age=31536000; SameSite=Lax';
  } else {
    document.cookie = 'sinabro_admin=; domain=.ws.ai.kr; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'sinabro_admin=; path=/; max-age=0; SameSite=Lax';
  }
};

interface AuthContextType {
  isAdmin: boolean;
  isAuthLoading: boolean;
  adminEmail: string;
  user: User | null;
  currentUserEmail: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  toggleAdminForTest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Firebase Auth 상태 변화 감지
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setCurrentUserEmail(firebaseUser.email);
        const hasAdminRole = firebaseUser.email === ADMIN_EMAIL;
        setIsAdmin(hasAdminRole);
        if (hasAdminRole) {
          localStorage.setItem('sinabro_admin_session', ADMIN_EMAIL);
          setAdminSubdomainCookie(true);
        }
      } else {
        setUser(null);
        // Firebase 로그아웃 상태일 때 로컬 세션 확인
        const saved = localStorage.getItem('sinabro_admin_session');
        if (saved === ADMIN_EMAIL) {
          setIsAdmin(true);
          setCurrentUserEmail(ADMIN_EMAIL);
          setAdminSubdomainCookie(true);
        } else {
          setIsAdmin(false);
          setCurrentUserEmail(null);
        }
      }
      setIsAuthLoading(false);
    });

    // 2. URL 파라미터 확인 (?admin=true)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true') {
        localStorage.setItem('sinabro_admin_session', ADMIN_EMAIL);
        setAdminSubdomainCookie(true);
        setIsAdmin(true);
        setCurrentUserEmail(ADMIN_EMAIL);
      }
    }

    return () => unsubscribe();
  }, []);

  // 구글 팝업 로그인
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        localStorage.setItem('sinabro_admin_session', ADMIN_EMAIL);
        setAdminSubdomainCookie(true);
      }
    } catch (error) {
      console.error('Firebase Google Sign-in error:', error);
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('sinabro_admin_session');
      setAdminSubdomainCookie(false);
      setIsAdmin(false);
      setCurrentUserEmail(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 개발/테스트용 토글
  const toggleAdminForTest = () => {
    if (isAdmin) {
      logout();
    } else {
      setIsAdmin(true);
      setCurrentUserEmail(ADMIN_EMAIL);
      localStorage.setItem('sinabro_admin_session', ADMIN_EMAIL);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        isAuthLoading,
        adminEmail: ADMIN_EMAIL,
        user,
        currentUserEmail,
        loginWithGoogle,
        logout,
        toggleAdminForTest,
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
