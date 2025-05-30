import React, { useState, useEffect, useRef } from 'react';
import { isValidEmail } from '../../utils'; // Asegúrate de que la ruta sea correcta

const EmployeeForm = ({ initialData = {}, onSubmit, onCancel, isEditing = false }) => {
  // 1. Inicialización del estado del formulario (solo se ejecuta al montar)
  const [formData, setFormData] = useState(() => {
    const defaultValues = {
      name: '',
      email: '',
      role: 'Desarrollador', // Valor por defecto
      status: 'active',     // Valor por defecto
    };
    // Si estamos editando y initialData tiene un ID, usamos initialData.
    // Sino, usamos los valores por defecto (para añadir o si initialData está vacío).
    // Esto ayuda a asegurar que 'add' comience limpio.
    if (isEditing && initialData && initialData.id) {
      return { ...defaultValues, ...initialData };
    }
    return defaultValues;
  });

  const [errors, setErrors] = useState({});

  // Ref para rastrear el valor anterior de isEditing
  const prevIsEditingRef = useRef(isEditing);

  // 2. Efecto para manejar cambios en initialData o isEditing
  useEffect(() => {
    const defaultValues = {
      name: '',
      email: '',
      role: 'Desarrollador',
      status: 'active',
    };

    // Si estamos en modo edición (`isEditing` es true)
    if (isEditing) {
      // Actualizamos el formulario con los datos de initialData
      // Esto es útil si initialData cambia mientras el formulario ya está visible para edición.
      setFormData({ ...defaultValues, ...initialData });
    } else {
      // Si estamos en modo "añadir" (`isEditing` es false)
      // Solo reseteamos el formulario a los valores por defecto si:
      // a) Acabamos de cambiar de modo "editar" a modo "añadir"
      if (prevIsEditingRef.current === true && isEditing === false) {
        setFormData(defaultValues);
      }
      // b) Si NO acabamos de cambiar de modo (es decir, ya estábamos en "añadir" o es el montaje inicial en "añadir")
      //    y el `useState` ya estableció el estado inicial, este useEffect no debería interferir
      //    para permitir que el usuario escriba. El `useState` se encarga del estado inicial para "añadir".
      //    Si `initialData` cambia su referencia pero sigue siendo `{}`, no hacemos nada aquí
      //    para preservar la entrada del usuario.
    }

    // Actualizar la referencia del valor anterior de isEditing para el próximo renderizado
    prevIsEditingRef.current = isEditing;

  }, [initialData, isEditing]); // Dependencias del efecto

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campo Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.name ? 'border-red-500' : ''
          }`}
          placeholder="Ingrese el nombre del empleado"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Campo Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.email ? 'border-red-500' : ''
          }`}
          placeholder="correo@ejemplo"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* Campo Rol */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role || 'developer'}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="admin">Administrador</option>
          <option value="manager">Gerente</option>
          <option value="developer">Desarrollador</option>
          <option value="designer">Diseñador</option>
          <option value="support">Soporte</option>
        </select>
      </div>

      {/* Campo Estado */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status || 'active'}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? 'Actualizar Empleado' : 'Agregar Empleado'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;