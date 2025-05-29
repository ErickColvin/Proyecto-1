import React, { useState } from 'react';
import Header from './components/Header';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import Modal from './components/Modal';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (id) => {
    // Lógica para obtener el empleado por ID
    setIsModalOpen(true);
  };

  const handleSubmit = (data) => {
    // Lógica para guardar el empleado
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onAddEmployee={handleAddEmployee} />
      <main className="p-4">
        <EmployeeList onEdit={handleEditEmployee} />
      </main>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentEmployee ? 'Edit Employee' : 'Add Employee'}
      >
        <EmployeeForm
          initialData={currentEmployee || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isEditing={!!currentEmployee}
        />
      </Modal>
    </div>
  );
};

export default App;