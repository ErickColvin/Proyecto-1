// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataProvider';
import Navbar      from './components/Navbar';
import Home        from './pages/Home';
import ImportExcel from './pages/ImportExcel';
import DataTable   from './pages/DataTable';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container mx-auto py-6">
          <Routes>
            {/* Ruta principal */}
            <Route path="/" element={<Home />} />
            {/* Importar Excel */}
            <Route path="/import" element={<ImportExcel />} />
            {/* Listado de productos */}
            <Route path="/products" element={<DataTable />} />
          </Routes>
        </main>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;