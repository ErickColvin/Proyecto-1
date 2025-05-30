import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si hay una sesión guardada al cargar la app
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Obtener usuarios desde la API
      const response = await fetch('/api/users');
      if (response.ok) {
        const users = await response.json();
        
        // Buscar usuario por correo
        const foundUser = users.find(u => 
          u.correo.toLowerCase() === credentials.email.toLowerCase()
        );

        if (foundUser) {
          // Verificar contraseña
          if (foundUser.contraseña === credentials.password) {
            // Contraseña correcta
            setUser(foundUser);
            setIsAuthenticated(true);
            
            // Guardar en localStorage para persistencia (sin contraseña)
            const userToSave = { ...foundUser };
            delete userToSave.contraseña; // No guardar contraseña en localStorage
            localStorage.setItem('currentUser', JSON.stringify(userToSave));
            
            return { success: true, user: foundUser };
          } else {
            return { success: false, message: 'Contraseña incorrecta' };
          }
        } else {
          return { success: false, message: 'Usuario no encontrado' };
        }
      }
      return { success: false, message: 'Error al conectar con el servidor' };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error de conexión' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 