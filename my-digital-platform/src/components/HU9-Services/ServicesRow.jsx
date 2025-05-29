import React from 'react';

const ServiceRow = ({ service, handleStatusClick, handleServiceTypeClick, selectedService }) => {
  return (
    <tr className="hover:bg-gray-600">
      <td className="border px-4 py-2">{service.serviceName}</td>
      <td className="border px-4 py-2">{service.requestId}</td>
      <td className="border px-4 py-2">{service.address}</td>
      <td className="border px-4 py-2">{service.description}</td>
      <td className="border px-4 py-2">{service.startDate}</td>
      <td className="border px-4 py-2">{service.endDate}</td>
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
            {selectedService && selectedService.requestId === service.requestId
              ? 'Seleccionando...'
              : 'Seleccionar tipo'}
          </button>
        )}
      </td>
    </tr>
  );
};

export default ServiceRow;