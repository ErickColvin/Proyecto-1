import React, { useState, useMemo, useEffect } from 'react';
import SearchBar from "./SearchBar";
import ServicesTable from './ServicesTable';
import Pagination from './Pagination';
import { useAuth } from '../../context/AuthContext'; // Asegurar que use peticiones autenticadas

const DataServices = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(''); // Para filtrar por estado
  const [page, setPage] = useState(1);
  const { authenticatedRequest } = useAuth(); // Usar el hook de autenticación

  useEffect(() => {
    console.log('[DataServices] Montado. Llamando a fetchServices.');
    fetchServices();
  }, [authenticatedRequest]);

  const fetchServices = async () => {
    console.log('[DataServices] Iniciando fetchServices...');
    try {
      const response = await authenticatedRequest('/api/services');
      const data = await response.json();
      console.log('[DataServices] Datos de servicios recibidos:', data);
      if (response.ok) {
        setServices(data);
      } else {
        console.error('[DataServices] Error en la respuesta de la API:', data.message);
        setServices([]);
      }
    } catch (error) {
      console.error('[DataServices] Error al hacer fetch de servicios:', error);
    }
  };
  
  // Filtrado mejorado
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const searchLower = search.toLowerCase();
      // Filtrar por múltiples campos
      const matchesSearch = 
        service.nameService?.toLowerCase().includes(searchLower) ||
        service.description?.toLowerCase().includes(searchLower) ||
        (service.direccion && service.direccion.toLowerCase().includes(searchLower));

      // Filtrar por categoría de estado
      const matchesCategory = !category || service.status === category;
      return matchesSearch && matchesCategory;
    });
  }, [services, search, category]);

  // Paginación
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const slice = useMemo(() =>
    filteredServices.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [filteredServices, page, itemsPerPage]
  );

  console.log(`[DataServices] Renderizando... Servicios: ${services.length}`);

  return (
    <div className="p-4 text-white">
      <SearchBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        services={services} // Pasar todos los servicios para los filtros
        setPage={setPage}
      />

      <ServicesTable slice={slice} />

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default DataServices;