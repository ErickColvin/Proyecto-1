// src/pages/DataTable.jsx
import React, { useState, useMemo } from 'react';

const DataServices = () => {
  const [services, setServices] = useState([
    {
      "serviceName": "Instalación de energía",
      "requestId": "SR001",
      "address": "Calle Elm 123, Springfield",
      "description": "Instalación de línea eléctrica para residencia.",
      "startDate": "2025-05-01",
      "endDate": "2025-05-03",
      "status": "PENDIENTE"
    },
    {
      "serviceName": "Reemplazo de medidor",
      "requestId": "SR002",
      "address": "Avenida Oak 456, Rivertown",
      "description": "Sustitución de medidor eléctrico por uno nuevo.",
      "startDate": "2025-04-20",
      "endDate": "2025-04-20",
      "status": "COMPLETADO"
    },
    {
      "serviceName": "Reparación de apagón",
      "requestId": "SR003",
      "address": "Camino Pine 789, Lakeside",
      "description": "Reparación de corte eléctrico por cables caídos.",
      "startDate": "2025-05-10",
      "endDate": "2025-05-11",
      "status": "PENDIENTE"
    },
    {
      "serviceName": "Mantenimiento de líneas",
      "requestId": "SR004",
      "address": "Calle Maple 321, Hillview",
      "description": "Mantenimiento rutinario de líneas aéreas.",
      "startDate": "2025-05-15",
      "endDate": "2025-05-16",
      "status": "PENDIENTE"
    },
    {
      "serviceName": "Mejora de servicio",
      "requestId": "SR005",
      "address": "Bulevar Birch 654, Greenfield",
      "description": "Ampliación de capacidad de servicio de 100A a 200A.",
      "startDate": "2025-05-05",
      "endDate": "2025-05-06",
      "status": "CANCELADO"
    }
  ]);

  const statusOptions = ["PENDIENTE", "COMPLETADO", "CANCELADO"];

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 20;

  const filtered = useMemo(() => {
    let list = services;
    if (search) {
      list = list.filter(p => p.serviceName.toLowerCase().includes(search.toLowerCase()));
    }
    if (category) {
      list = list.filter(p => p.status === category);
    }
    return list;
  }, [services, search, category]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const slice = filtered.slice((page - 1) * perPage, page * perPage);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [isStatusDrawerOpen, setIsStatusDrawerOpen] = useState(false);
  const [selectedStatusService, setSelectedStatusService] = useState(null);

  const serviceTypes = [
    { id: 1, name: 'Instalación', description: 'Servicios de instalación nuevos' },
    { id: 2, name: 'Mantenimiento', description: 'Servicios de mantenimiento regular' },
    { id: 3, name: 'Reparación', description: 'Servicios de reparación y emergencia' },
    { id: 4, name: 'Mejora', description: 'Servicios de actualización y mejora' }
  ];

  const handleServiceTypeClick = (service) => {
    setSelectedService(service);
    setIsDrawerOpen(true);
  };

  const handleStatusClick = (service) => {
    setSelectedStatusService(service);
    setIsStatusDrawerOpen(true);
  };

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
          <option value="">Todos los estados</option>
          {[...new Set(services.map(p => p.status))].map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <table className="min-w-full bg-gray-800 text-white rounded shadow table-auto">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2">Nombre del servicio</th>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Dirección</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2">Fecha de inicio</th>
            <th className="px-4 py-2">Fecha de fin</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Tipo de Servicio</th>
          </tr>
        </thead>
        <tbody>
          {slice.map(p => (
            <tr key={p.requestId} className="hover:bg-gray-600">
              <td className="border px-4 py-2">{p.serviceName}</td>
              <td className="border px-4 py-2">{p.requestId}</td>
              <td className="border px-4 py-2">{p.address}</td>
              <td className="border px-4 py-2">{p.description}</td>
              <td className="border px-4 py-2">{p.startDate}</td>
              <td className="border px-4 py-2">{p.endDate}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleStatusClick(p)}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {p.status || 'Seleccionar estado'}
                </button>
              </td>
              <td className="border px-4 py-2">
                {p.serviceType ? (
                  <span>{p.serviceType}</span>
                ) : (
                  <button
                    onClick={() => handleServiceTypeClick(p)}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {selectedService && selectedService.requestId === p.requestId
                      ? 'Seleccionando...'
                      : 'Seleccionar tipo'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isDrawerOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Seleccionar Tipo de Servicio</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {serviceTypes.map(type => (
                <div
                  key={type.id}
                  onClick={() => {
                    setServices(prev =>
                      prev.map(s =>
                        s.requestId === selectedService.requestId
                          ? { ...s, serviceType: type.name }
                          : s
                      )
                    );
                    setIsDrawerOpen(false);
                  }}
                  className="p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                >
                  <h3 className="font-bold">{type.name}</h3>
                  <p className="text-sm text-gray-300">{type.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Status Drawer */}
      {isStatusDrawerOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Seleccionar Estado</h2>
              <button
                onClick={() => setIsStatusDrawerOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {statusOptions.map(status => (
                <div
                  key={status}
                  onClick={() => {
                    setServices(prev =>
                      prev.map(s =>
                        s.requestId === selectedStatusService.requestId
                          ? { ...s, status: status }
                          : s
                      )
                    );
                    setIsStatusDrawerOpen(false);
                  }}
                  className="p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                >
                  <h3 className="font-bold">{status}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Status Drawer Overlay */}
      {isStatusDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsStatusDrawerOpen(false)}
        />
      )}

      {(isDrawerOpen || isStatusDrawerOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => { setIsDrawerOpen(false); setIsStatusDrawerOpen(false); }}
        />
      )}
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

export default DataServices;