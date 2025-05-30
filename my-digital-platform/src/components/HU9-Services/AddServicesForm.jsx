import React, { useState } from 'react';
import { postServ } from './postServices';

const AddServiceForm = ({ onAddService, onClose }) => {
  const [nameService, setNameService] = useState('');
  const [ID, setID] = useState('');
  const [direccion, setDireccion] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [tipoDeServicio, setTipoDeServicio] = useState('')

  const handleSubmit = async (e) => {

    
    e.preventDefault();
    try {
      const serviceData = {
        nameService,
        ID,
        direccion,
        description,
        startDate,
        endDate,
        status,
        tipoDeServicio,
      };
      console.log(serviceData)
      await postServ(serviceData);

    } catch (error) {
      console.error('Error al agregar el servicio:', error);
    }
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Agregar Nuevo Servicio</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nombre del Servicio</label>
            <input
              type="text"
              name="nameService"
              value={nameService}
              onChange={(e) => setNameService(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">ID de Solicitud</label>
            <input
              type="text"
              name="ID"
              value={ID}
              onChange={(e) => setID(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Descripción</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Fecha de Inicio</label>
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Fecha de Fin</label>
            <input
              type="date"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Estado</label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
              required
            >
              <option value="" disabled>Seleccione estado</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN PROGRESO">En Progreso</option>
              <option value="COMPLETADO">Completado</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Tipo de Servicio</label>
            <select
              name="tipoDeServicio"
              value={tipoDeServicio}
              onChange={(e) => setTipoDeServicio(e.target.value)}
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