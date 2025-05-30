import React, { useState } from 'react';
import { EmployeeProvider } from './context/EmployeeContext';
import Header from './components/Header';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import Modal from './components/Modal';
import { useEmployees } from './context/EmployeeContext';

function EmployeeManagementApp() {
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

  const getCurrentEmployeeData = () => {
    if (isEditing && currentEmployeeId) {
      const employee = getEmployee(currentEmployeeId);
      if (employee) {
        const { name, email, role, status } = employee;
        return { name, email, role, status };
      }
    }
    return undefined;
  };

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
        title={isEditing ? 'Edit Employee' : 'Add New Employee'}
      >
        <EmployeeForm
          initialData={getCurrentEmployeeData()}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={isEditing}
        />
      </Modal>
    </div>
  );
}

function App() {
  return (
    <EmployeeProvider>
      <EmployeeManagementApp />
    </EmployeeProvider>
  );
}

export default App;