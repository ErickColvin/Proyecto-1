import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Configuración de la API - usar proxy de Vite
const API_BASE_URL = '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Función para hacer peticiones autenticadas
  const authenticatedRequest = async (url, options = {}) => {
    const currentToken = token || localStorage.getItem('authToken');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
        ...options.headers,
      },
    };

    // Evitar duplicar el prefijo cuando la URL ya incluye la base
    const fullUrl = (url.startsWith('http') || url.startsWith(API_BASE_URL)) 
      ? url 
      : `${API_BASE_URL}${url}`;
    const response = await fetch(fullUrl, config);
    
    // Si el token es inválido, cerrar sesión
    if (response.status === 401 || response.status === 403) {
      logout();
      throw new Error('Sesión expirada');
    }
    
    return response;
  };

  // Verificar token al cargar la app
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('authToken');
      
      if (savedToken) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${savedToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setToken(savedToken);
            setUser(data.user);
      setIsAuthenticated(true);
          } else {
            // Token inválido, limpiar
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Error verificando token:', error);
          localStorage.removeItem('authToken');
        }
      }
      
    setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Guardar token y datos del usuario
        localStorage.setItem('authToken', data.token);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error de conexión' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        // Guardar token y datos del usuario
        localStorage.setItem('authToken', data.token);
        setToken(data.token);
        setUser(data.user);
            setIsAuthenticated(true);
            
        return { success: true, user: data.user };
          } else {
        return { success: false, message: data.message };
        }
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, message: 'Error de conexión' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    token,
    login,
    register,
    logout,
    authenticatedRequest
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 