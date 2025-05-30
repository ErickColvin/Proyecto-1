import React from 'react';

const ServiceTypeDrawer = ({ isOpen, onClose, tipoDeServicio, selectedService, setServices }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Seleccionar Tipo de Servicio</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {tipoDeServicio.map(type => (
            <div
              key={type.ID}
              onClick={() => {
                setServices(prev =>
                  prev.map(s =>
                    s.ID === selectedService.ID
                      ? { ...s, serviceType: type.name }
                      : s
                  )
                );
                onClose();
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
  );
};

export default ServiceTypeDrawer;