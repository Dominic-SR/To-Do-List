import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUser,
  findUserByEmail,
  findUserById,
  hashPassword,
  saveGoogleUser,
} from '../database/authDb';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Read initial user state on app mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const sessionId = Number(localStorage.getItem('auth_user_id'));
        if (sessionId) {
          const storedUser = await findUserById(sessionId);
          if (storedUser) setUser(storedUser);
        }
      } catch (error) {
        console.error('Failed to restore auth session:', error);
        localStorage.removeItem('auth_user_id');
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (userData) => {
    const savedUser = await saveGoogleUser(userData);
    const authenticatedUser = typeof savedUser === 'number'
      ? await findUserById(savedUser)
      : savedUser
    setUser(authenticatedUser || userData);
    if (authenticatedUser?.id) localStorage.setItem('auth_user_id', String(authenticatedUser.id));
    return authenticatedUser || userData;
  };

  const register = async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) throw new Error('An account with this email already exists.');

    const id = await createUser({ name, email: normalizedEmail, passwordHash: await hashPassword(password) });
    const newUser = await findUserById(id);
    setUser(newUser);
    localStorage.setItem('auth_user_id', String(id));
    return newUser;
  };

  const authenticate = async (email, password) => {
    const existingUser = await findUserByEmail(email);
    if (!existingUser || existingUser.passwordHash !== await hashPassword(password)) {
      throw new Error('Invalid email or password.');
    }

    setUser(existingUser);
    localStorage.setItem('auth_user_id', String(existingUser.id));
    return existingUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user_id');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    authenticate,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook to consume Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};