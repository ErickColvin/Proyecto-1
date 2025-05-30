import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateId } from '../utils';

const EmployeeContext = createContext();

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};


export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);

  // Load initial data from localStorage
  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    } else {
      // Initialize with sample data if empty
      const initialEmployees = [
        {
          id: generateId(),
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          id: generateId(),
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'developer',
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          id: generateId(),
          name: 'Robert Johnson',
          email: 'robert@example.com',
          role: 'manager',
          status: 'inactive',
          createdAt: new Date().toISOString(),
        },
      ];
      setEmployees(initialEmployees);
      localStorage.setItem('employees', JSON.stringify(initialEmployees));
    }
  }, []);

  // Save to localStorage whenever employees change
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const addEmployee = (data) => {
    const newEmployee = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const updateEmployee = (id, data) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === id
          ? { ...employee, ...data }
          : employee
      )
    );
  };

  const deleteEmployee = (id) => {
    setEmployees((prev) => prev.filter((employee) => employee.id !== id));
  };

  const getEmployee = (id) => {
    return employees.find((employee) => employee.id === id);
  };

  const searchEmployees = (query, filterStatus) => {
    return employees.filter((employee) => {
      const matchesQuery =
        query === '' ||
        employee.name.toLowerCase().includes(query.toLowerCase()) ||
        employee.email.toLowerCase().includes(query.toLowerCase()) ||
        employee.role.toLowerCase().includes(query.toLowerCase());
      
      const matchesStatus =
        filterStatus === 'all' || employee.status === filterStatus;
      
      return matchesQuery && matchesStatus;
    });
  };

  const value = {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    searchEmployees,
  };

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
};