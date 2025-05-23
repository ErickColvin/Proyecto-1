import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="p-6 text-center">
    <h1 className="text-3xl font-bold mb-4">Bienvenido a tu Plataforma de Inventario</h1>
    <p className="mb-6">Digitaliza tu stock con un clic y evita quiebres de inventario.</p>
    <div className="space-x-4">
      <Link to="/import" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
        Importar Inventario
      </Link>
      <Link to="/products" className="border px-5 py-2 rounded hover:bg-gray-100">
        Ver Productos
      </Link>
    </div>
  </div>
);

export default Home;