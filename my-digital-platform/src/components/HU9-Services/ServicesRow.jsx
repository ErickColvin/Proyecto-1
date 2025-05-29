import React from 'react';

const ServiceRow = ({ service, handleStatusClick, handleServiceTypeClick, selectedService }) => {
  const formatDate = date =>
    date ? new Date(date).toISOString().split('T')[0] : '';

  return (
    <tr className="hover:bg-gray-600">
      <td className="border px-4 py-2">{service.nameService}</td>
      <td className="border px-4 py-2">{service.ID}</td>
      <td className="border px-4 py-2">{service.direccion}</td>
      <td className="border px-4 py-2">{service.description}</td>
      <td className="border px-4 py-2">{formatDate(service.startDate)}</td>
      <td className="border px-4 py-2">{formatDate(service.endDate)}</td>
      <td className="border px-4 py-2">
        <button
          onClick={() => handleStatusClick(service)}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          {service.status || 'Seleccionar estado'}
        </button>
      </td>
      <td className="border px-4 py-2">
        {service.serviceType ? (
          <span>{service.serviceType}</span>
        ) : (
          <button
            onClick={() => handleServiceTypeClick(service)}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {selectedService && selectedService.ID === service.ID
              ? 'Seleccionando...'
              : 'Seleccionar tipo'}
          </button>
        )}
      </td>
    </tr>
  );
};

export default ServiceRow;