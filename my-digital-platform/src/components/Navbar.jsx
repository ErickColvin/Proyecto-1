// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { alerts } = useContext(DataContext) || { alerts: [] };
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Si no está autenticado, mostrar navbar mínima
  if (!isAuthenticated) {
    return (
      <nav className="bg-gray-900 shadow p-4 flex justify-between text-white">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Sistema de Inventario</h1>
        </div>
        <div>
          <NavLink to="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            Iniciar Sesión
          </NavLink>
        </div>
      </nav>
    );
  }

  // Navbar completa para usuarios autenticados
  return (
    <nav className="bg-gray-900 shadow p-4 flex justify-between text-white">
      <div className="flex space-x-4 items-center">
        <h1 className="text-lg font-bold mr-4">Inventario</h1>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `hover:text-blue-300 px-3 py-1 rounded ${isActive ? 'bg-blue-600' : ''}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/import" 
          className={({ isActive }) => 
            `hover:text-blue-300 px-3 py-1 rounded ${isActive ? 'bg-blue-600' : ''}`
          }
        >
          Importar Excel
        </NavLink>
        <NavLink 
          to="/services" 
          className={({ isActive }) => 
            `hover:text-blue-300 px-3 py-1 rounded ${isActive ? 'bg-blue-600' : ''}`
          }
        >
          Servicios
        </NavLink>
        {user?.rol === 'admin' && (
          <NavLink 
            to="/admin" 
            className={({ isActive }) => 
              `hover:text-blue-300 px-3 py-1 rounded ${isActive ? 'bg-blue-600' : ''}`
            }
          >
            Admin
          </NavLink>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative">
          🔔
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {alerts.length}
            </span>
          )}
        </button>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm">Hola, {user?.nombre}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;