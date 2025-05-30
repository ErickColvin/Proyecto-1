// src/components/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
// Si necesitas datos de empleados en el navbar, descomenta esta línea:
// import { useEmployees } from '../context/EmployeeProvider';

const Navbar = () => {
  // Si necesitas usar datos de empleados, descomenta estas líneas:
  // const { employees } = useEmployees();
  // const alerts = []; // Define tu lógica de alertas aquí
  
  // Por ahora, definimos alerts como array vacío para evitar errores
  const alerts = [];

  return (
    <nav className="bg-gray-900 shadow p-4 flex justify-between text-white">
      <NavLink to="/employees" className="hover:text-blue-300">Empleados</NavLink>
      <div className="flex space-x-4">
        <NavLink to="/"        className="hover:text-blue-300">Dashboard</NavLink>
        <NavLink to="/import"  className="hover:text-blue-300">Importar Excel</NavLink>
        <NavLink to="/products" className="hover:text-blue-300">Productos</NavLink>
      </div>
      <div>
        <button className="relative">
          🔔
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {alerts.length}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;