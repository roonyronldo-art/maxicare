'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { pb } from '../lib/pocketbase';


const AuthContext = createContext({ user: null, loading: true });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load current user from PocketBase auth store
    setUser(pb.authStore.model);
    setLoading(false);
    // Listen to auth changes
    const unsub = pb.authStore.onChange(() => {
      setUser(pb.authStore.model);
    });
    return unsub;
  }, []);

  const logout = () => pb.authStore.clear();

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
