import React from 'react';
import ServiceRow from './ServicesRow';

const ServicesTable = ({ slice, handleStatusClick, handleServiceTypeClick, selectedService }) => {
  return (
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
          <ServiceRow 
            key={p.requestId} 
            service={p} 
            handleStatusClick={handleStatusClick}
            handleServiceTypeClick={handleServiceTypeClick}
            selectedService={selectedService}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ServicesTable;