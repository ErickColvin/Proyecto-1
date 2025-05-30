import React, { useState, useMemo, useContext, useEffect } from 'react';
import SearchBar from "./SearchBar";
import ServicesTable from './ServicesTable';
import Pagination from './Pagination';
import ServiceTypeDrawer from './ServiceTypeDrawer';
import StatusDrawer from './StatusDrawer';

const initialStatusOptions = ["PENDIENTE", "EN_PROGRESO", "COMPLETADO", "CANCELADO"];

const initialServiceTypes = [
  { id: 1, name: "Instalación", description: "Servicios de instalación nuevos" },
  { id: 2, name: "Mantenimiento", description: "Servicios de mantenimiento preventivo" },
  { id: 3, name: "Reparación", description: "Servicios de reparación correctiva" },
  { id: 4, name: "Mejora", description: "Servicios de mejora y actualización" }
];

const DataServices = () => {
  const [service, setService] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStatusDrawerOpen, setIsStatusDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStatusService, setSelectedStatusService] = useState(null);
  const [serviceTypes, setServiceTypes] = useState(initialServiceTypes);
  const [statusOptions, setStatusOptions] = useState(initialStatusOptions);
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const data = await response.json();

        setService(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);
  
  // Calculate total pages based on services length
  const totalPages = Math.ceil(service.length / 10);

  // Filtered services based on search and category
  const filteredServices = useMemo(() => {
    return service.filter(service => {
      const matchesSearch = service.nameService.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || service.estado === category;
      return matchesSearch && matchesCategory;
    });
  }, [service, search, category]);

  // Slice logic for pagination
  const slice = useMemo(() =>
    filteredServices.slice((page - 1) * 10, page * 10),
    [filteredServices, page]
  );

  // Handler functions
  const handleStatusClick = (service) => {
    setSelectedStatusService(service);
    setIsStatusDrawerOpen(true);
  };

  const handleServiceTypeClick = (service) => {
    setSelectedService(service);
    setIsDrawerOpen(true);
  };


  return (
    <div className="p-4 text-white">
      <SearchBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        services={service}
        setPage={setPage}
      />

      <ServicesTable
        slice={slice}
        handleStatusClick={handleStatusClick}
        handleServiceTypeClick={handleServiceTypeClick}
        selectedService={selectedService}
      />

      <ServiceTypeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        serviceTypes={serviceTypes}
        selectedService={selectedService}
        setServices={setService}
      />

      <StatusDrawer
        isOpen={isStatusDrawerOpen}
        onClose={() => setIsStatusDrawerOpen(false)}
        statusOptions={statusOptions}
        selectedStatusService={selectedStatusService}
        setServices={setService}
      />

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default DataServices;