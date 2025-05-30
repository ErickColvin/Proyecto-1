// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataProvider';
import { AuthProvider } from './context/AuthContext';
import AdminView from './pages/AdminView';
import Navbar      from './components/Navbar';
import Home        from './pages/Home';
import ImportExcel from './pages/ImportExcel';
import DataTable   from './pages/DataTable';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Navbar /> 
          <main className="container mx-auto py-6">
            <Routes>
               {/* Vista de admin */}
              <Route path="/admin" element={<AdminView />} />
              {/* Ruta principal */}
              <Route path="/" element={<Login />} />
              {/* Importar Excel */}
              <Route path="/import" element={<ImportExcel />} />
              {/* Listado de productos */}
              <Route path="/products" element={<DataTable />} />
               {/* Pestaña login */}
              <Route path="/login" element={<Login />} />
              <Route path='/home' element={<Home />} />
            </Routes>
          </main>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
export default App;