import React from 'react';
import { Users } from 'lucide-react';

const Header = ({ onAddEmployee }) => {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">Employee Management</h1>
          </div>
          <button
            onClick={onAddEmployee}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Employee
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;