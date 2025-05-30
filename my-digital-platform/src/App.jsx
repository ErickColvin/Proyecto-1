import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EmployeeProvider } from './context/EmployeeProvider'; // Corregida la ruta
import Navbar from './components/Navbar';
import Home from './pages/Home';
// import ImportExcel from './pages/ImportExcel';
// import { DataTable } from './pages/DataTable';
// import DataServices from './components/DataServices';
import EmployeeManagementModule from "./components/HU10/HU10app";

function App() {
  return (
    <EmployeeProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container mx-auto py-6">
          <Routes>
            {/* Ruta principal */}
            <Route path="/" element={<Home />} />
            {/* Importar Excel */}
            {/* <Route path="/import" element={<ImportExcel />} /> */}
            {/* Listado de productos */}
            {/* <Route path="/products" element={<DataTable />} />
            <Route path="/services" element={<DataServices />} /> */}
            {/* Ruta para empleados - solo una ruta, no duplicada */}
            <Route path="/employees" element={<EmployeeManagementModule />} />
          </Routes>
        </main>
      </BrowserRouter>
    </EmployeeProvider>
  );
}

export default App;