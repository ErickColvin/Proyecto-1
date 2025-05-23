// src/pages/DataTable.jsx
import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../context/DataContext';

const DataTable = () => {
  const { products } = useContext(DataContext) || { products: [] };
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage]         = useState(1);
  const perPage = 20;

  const filtered = useMemo(() => {
    let list = products;
    if (search) {
      list = list.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()));
    }
    if (category) {
      list = list.filter(p => p.categoria === category);
    }
    return list;
  }, [products, search, category]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const slice      = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-4 text-white">
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border px-2 py-1 bg-gray-700 text-white rounded"
        />
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1); }}
          className="border px-2 py-1 bg-gray-700 text-white rounded"
        >
          <option value="">Todas las categorías</option>
          {[...new Set(products.map(p => p.categoria))].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <table className="min-w-full bg-gray-800 text-white rounded shadow table-auto">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2">Producto</th>
            <th className="px-4 py-2">Categoría</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Precio</th>
          </tr>
        </thead>
        <tbody>
          {slice.map(p => (
            <tr key={p.id} className="hover:bg-gray-600">
              <td className="border px-4 py-2">{p.nombre}</td>
              <td className="border px-4 py-2">{p.categoria}</td>
              <td className="border px-4 py-2">{p.stock}</td>
              <td className="border px-4 py-2">${p.precioUnitario.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center space-x-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >Anterior</button>
        <span className="px-3 py-1">{page} / {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >Siguiente</button>
      </div>
    </div>
  );
};

export default DataTable;