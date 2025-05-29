import React, { useState } from 'react';
import AddServiceButton from './AddServicesButton';

const SearchBar = ({ search, setSearch, category, setCategory, services, setPage }) => {
  const [servicesf, setServicesf] = useState([])
  const addService = (srv) => {
    setServices([...servicesf, srv])
  }
  return (
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
        <option value="">Todos los estados</option>
        {[...new Set(services.map(p => p.status))].map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <AddServiceButton onAddService={addService} />
    </div>
  );
};

export default SearchBar;