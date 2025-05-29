import React, { useState } from 'react';

const AddServiceForm = ({ onAddService, onClose }) => {
  const [newService, setNewService] = useState({
    serviceName: "",
    requestId: "",
    address: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "PENDIENTE"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddService(newService);
    onClose();
  };

  const handleChange = (e) => {
    setNewService({
      ...newService,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Agregar Nuevo Servicio</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nombre del Servicio</label>
            <input
              type="text"
              name="serviceName"
              value={newService.serviceName}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">ID de Solicitud</label>
            <input
              type="text"
              name="requestId"
              value={newService.requestId}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Dirección</label>
            <input
              type="text"
              name="address"
              value={newService.address}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Descripción</label>
            <textarea
              name="description"
              value={newService.description}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Fecha de Inicio</label>
            <input
              type="date"
              name="startDate"
              value={newService.startDate}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Fecha de Fin</label>
            <input
              type="date"
              name="endDate"
              value={newService.endDate}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Estado</label>
            <select
              name="status"
              value={newService.status}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN PROGRESO">En Progreso</option>
              <option value="COMPLETADO">Completado</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Tipo de Servicio</label>
            <select
              name="serviceType"
              value={newService.serviceType || ""}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded"
              required
            >
              <option value="" disabled>Seleccione tipo</option>
              <option value="INSTALACIÓN">Instalación</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
              <option value="REPARACIÓN">Reparación</option>
              <option value="MEJORA">Mejora</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceForm;