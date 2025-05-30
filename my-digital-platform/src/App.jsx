// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataProvider';
import AdminView from './pages/AdminView';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ImportExcel from './pages/ImportExcel';
import DataServices from './components/HU9-Services/DataServices';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DataProvider>
          <Navbar />
          <main className="container mx-auto py-6">
            <Routes>
              <Route path="/admin" element={<AdminView />} />
              <Route path="/" element={<Login />} />
              <Route path="/import" element={<ImportExcel />} />
              <Route path="/services" element={<DataServices />} />
              <Route path="/login" element={<Login />} />
              <Route path='/home' element={<Home />} />
            </Routes>
          </main>
        </DataProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;