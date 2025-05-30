// src/modules/EmployeeManagement/EmployeeManagementModule.jsx
import React, { useState } from 'react';
import { EmployeeProvider, useEmployees } from '../../context/EmployeeProvider';
import Header from './Header';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import Modal from './Modal';

const EmployeeManagementContent = () => {
  const { addEmployee, updateEmployee, getEmployee } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

  const handleAddEmployee = () => {
    setIsEditing(false);
    setCurrentEmployeeId(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (id) => {
    setIsEditing(true);
    setCurrentEmployeeId(id);
    setIsModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (isEditing && currentEmployeeId) {
      updateEmployee(currentEmployeeId, data);
    } else {
      addEmployee(data);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Obtener los datos del empleado actual para edición
  const currentEmployee = isEditing && currentEmployeeId ? getEmployee(currentEmployeeId) : {};

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onAddEmployee={handleAddEmployee} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <EmployeeList onEdit={handleEditEmployee} />
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={isEditing ? 'Editar Empleado' : 'Agregar Nuevo Empleado'}
      >
        <EmployeeForm
          initialData={currentEmployee}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={isEditing}
        />
      </Modal>
    </div>
  );
};

const EmployeeManagementModule = () => {
  return (
    <EmployeeProvider>
      <EmployeeManagementContent />
    </EmployeeProvider>
  );
};

export default EmployeeManagementModule;