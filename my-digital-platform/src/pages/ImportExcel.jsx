import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';

const ImportExcel = () => {
  const { uploadExcel } = useContext(DataContext);
  const [file, setFile]     = useState(null);
  const [message, setMessage] = useState('');
  const navigate              = useNavigate();

  const handleChange = e => {
    setMessage('');
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) {
      setMessage('⚠️ Selecciona un archivo primero');
      return;
    }
    const ok = await uploadExcel(file);
    if (ok) {
      setMessage('✅ Inventario cargado correctamente');
      setTimeout(() => navigate('/products'), 800);
    } else {
      setMessage('❌ Error al cargar, intenta de nuevo');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded shadow text-white">
      <h2 className="text-2xl font-bold mb-4">Importar Inventario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleChange}
          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          Subir
        </button>
      </form>
      {message && (
        <p className="mt-4 italic">
          {message}
        </p>
      )}
    </div>
  );
};

export default ImportExcel;