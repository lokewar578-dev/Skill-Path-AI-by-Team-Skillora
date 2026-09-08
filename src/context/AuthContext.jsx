import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createMockJwtToken, 
  isTokenValid, 
  getStoredToken, 
  saveStoredToken, 
  clearStoredToken, 
  getStoredUserProfile 
} from '../utils/jwt';
import { OFFICIAL_PERSONAS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingToken, setIsLoadingToken] = useState(true);

  // Validate JWT token on mount & storage check
  useEffect(() => {
    const existingToken = getStoredToken();
    if (existingToken && isTokenValid(existingToken)) {
      const savedUser = getStoredUserProfile() || OFFICIAL_PERSONAS[0];
      setToken(existingToken);
      setCurrentUser(savedUser);
    } else {
      // Clear stale authentication data if missing, malformed, or expired
      clearStoredToken();
      setToken(null);
      setCurrentUser(null);
    }
    setIsLoadingToken(false);
  }, []);

  // Login handler
  const login = (userObj) => {
    const newJwtToken = createMockJwtToken(userObj);
    saveStoredToken(newJwtToken, userObj);
    setToken(newJwtToken);
    setCurrentUser(userObj);
    return newJwtToken;
  };

  // Registration handler for newcomer
  const register = (newUserObj) => {
    const newJwtToken = createMockJwtToken(newUserObj);
    saveStoredToken(newJwtToken, newUserObj);
    setToken(newJwtToken);
    setCurrentUser(newUserObj);
    return newJwtToken;
  };

  // Logout handler
  const logout = () => {
    clearStoredToken();
    setToken(null);
    setCurrentUser(null);
  };

  // Profile update handler
  const updateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
    saveStoredToken(token, updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      token,
      currentUser,
      setCurrentUser,
      isLoadingToken,
      isAuthenticated: Boolean(token && isTokenValid(token)),
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
