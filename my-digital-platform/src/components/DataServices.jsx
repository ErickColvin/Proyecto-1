import React, { useState, useMemo } from 'react';
import SearchBar from "./SearchBar";
import ServicesTable from './ServicesTable';
import Pagination from './Pagination';
import ServiceTypeDrawer from './ServiceTypeDrawer';
import StatusDrawer from './StatusDrawer';

const initialServices = [
  {
    "serviceName": "Instalación de energía",
    "requestId": "SR001",
    "address": "Calle Elm 123, Springfield",
    "description": "Instalación de línea eléctrica para residencia.",
    "startDate": "2025-05-01",
    "endDate": "2025-05-03",
    "status": "PENDIENTE"
  },
  {
    "serviceName": "Reemplazo de medidor",
    "requestId": "SR002",
    "address": "Avenida Oak 456, Rivertown",
    "description": "Sustitución de medidor eléctrico por uno nuevo.",
    "startDate": "2025-04-20",
    "endDate": "2025-04-20",
    "status": "COMPLETADO"
  },
  {
    "serviceName": "Reparación de apagón",
    "requestId": "SR003",
    "address": "Camino Pine 789, Lakeside",
    "description": "Reparación de corte eléctrico por cables caídos.",
    "startDate": "2025-05-10",
    "endDate": "2025-05-11",
    "status": "PENDIENTE"
  },
  {
    "serviceName": "Mantenimiento de líneas",
    "requestId": "SR004",
    "address": "Calle Maple 321, Hillview",
    "description": "Mantenimiento rutinario de líneas aéreas.",
    "startDate": "2025-05-15",
    "endDate": "2025-05-16",
    "status": "PENDIENTE"
  },
  {
    "serviceName": "Mejora de servicio",
    "requestId": "SR005",
    "address": "Bulevar Birch 654, Greenfield",
    "description": "Ampliación de capacidad de servicio de 100A a 200A.",
    "startDate": "2025-05-05",
    "endDate": "2025-05-06",
    "status": "CANCELADO"
  }
];

const initialStatusOptions = ["PENDIENTE", "EN_PROGRESO", "COMPLETADO", "CANCELADO"];

const initialServiceTypes = [
  { id: 1, name: "Instalación", description: "Servicios de instalación nuevos" },
  { id: 2, name: "Mantenimiento", description: "Servicios de mantenimiento preventivo" },
  { id: 3, name: "Reparación", description: "Servicios de reparación correctiva" },
  { id: 4, name: "Mejora", description: "Servicios de mejora y actualización" }
];

const DataServices = () => {
  // State declarations
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [services, setServices] = useState(initialServices);
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStatusDrawerOpen, setIsStatusDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStatusService, setSelectedStatusService] = useState(null);
  const [serviceTypes, setServiceTypes] = useState(initialServiceTypes);
  const [statusOptions, setStatusOptions] = useState(initialStatusOptions);

  // Calculate total pages based on services length
  const totalPages = Math.ceil(services.length / 10);

  // Filtered services based on search and category
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.serviceName.toLowerCase().includes(search.toLowerCase()) ||
                          service.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || service.status === category;
      return matchesSearch && matchesCategory;
    });
  }, [services, search, category]);

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
        services={services}
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
        setServices={setServices}
      />

      <StatusDrawer 
        isOpen={isStatusDrawerOpen}
        onClose={() => setIsStatusDrawerOpen(false)}
        statusOptions={statusOptions}
        selectedStatusService={selectedStatusService}
        setServices={setServices}
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