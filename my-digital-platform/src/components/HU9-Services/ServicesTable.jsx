import React from 'react';

// Función para determinar el estilo del estado
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'completado':
      return 'bg-green-500 text-white';
    case 'en_proceso':
      return 'bg-yellow-500 text-black';
    case 'pendiente':
      return 'bg-blue-500 text-white';
    case 'cancelado':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

// Función para formatear fechas a YYYY-MM-DD
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Función para derivar el tipo de servicio
const getServiceType = (name) => {
  if (!name) return 'GENERAL';
  if (name.toLowerCase().includes('reparaci')) return 'REPARACIÓN';
  if (name.toLowerCase().includes('instalaci')) return 'INSTALACIÓN';
  if (name.toLowerCase().includes('manteni')) return 'MANTENIMIENTO';
  return 'GENERAL';
};

const ServicesTable = ({ slice }) => {
  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg mt-6">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-700">
            <th className="py-3 px-4 text-left text-white font-semibold">Nombre del servicio</th>
            <th className="py-3 px-4 text-left text-white font-semibold">ID</th>
            <th className="py-3 px-4 text-left text-white font-semibold">Dirección</th>
            <th className="py-3 px-4 text-left text-white font-semibold">Descripción</th>
            <th className="py-3 px-4 text-left text-white font-semibold">Fecha de inicio</th>
            <th className="py-3 px-4 text-left text-white font-semibold">Fecha de fin</th>
            <th className="py-3 px-4 text-center text-white font-semibold">Estado</th>
            <th className="py-3 px-4 text-left text-white font-semibold">Tipo de Servicio</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((service, index) => (
            <tr key={service._id} className="border-b border-gray-700 hover:bg-gray-600">
              <td className="py-2 px-4 text-white">{service.nameService || 'N/A'}</td>
              <td className="py-2 px-4 text-white">{service.ID || `SR${String(index + 1).padStart(3, '0')}`}</td>
              <td className="py-2 px-4 text-white">{service.direccion || 'N/A'}</td>
              <td className="py-2 px-4 text-white">{service.description || 'N/A'}</td>
              <td className="py-2 px-4 text-white">{formatDate(service.startDate)}</td>
              <td className="py-2 px-4 text-white">{formatDate(service.endDate)}</td>
              <td className="py-2 px-4 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(service.status)}`}>
                  {service.status ? service.status.toUpperCase().replace('_', ' ') : 'N/A'}
                </span>
              </td>
              <td className="py-2 px-4 text-white">{getServiceType(service.nameService)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesTable;