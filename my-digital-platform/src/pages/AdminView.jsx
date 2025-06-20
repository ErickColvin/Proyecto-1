import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importar el contexto de autenticación

const AdminView = () => {
  const { user, logout, authenticatedRequest } = useAuth(); // Usar el hook de autenticación
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    nombre: '',
    correo: '',
    rol: 'usuario',
    contraseña: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[AdminView] Montado. Usuario actual:', user);
    if (user?.rol === "admin") {
      console.log('[AdminView] Usuario es admin. Llamando a fetchUsuarios.');
      fetchUsuarios();
    }
  }, [user]);

  const fetchUsuarios = async () => {
    console.log('[AdminView] Iniciando fetchUsuarios...');
    console.log('[AdminView] authenticatedRequest disponible:', !!authenticatedRequest);
    setLoading(true);
    try {
      console.log('[AdminView] Haciendo petición a /api/users...');
      const response = await authenticatedRequest('/api/users');
      console.log('[AdminView] Respuesta recibida:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('[AdminView] Datos de usuarios recibidos:', data);
      console.log('[AdminView] Tipo de datos:', typeof data, Array.isArray(data));
      
      if (response.ok) {
        console.log('[AdminView] Respuesta OK, estableciendo usuarios...');
        setUsuarios(data);
        console.log('[AdminView] Usuarios establecidos exitosamente');
      } else {
        console.error('[AdminView] Error en la respuesta de la API:', data.message || data.error);
        setUsuarios([]);
        alert(`Error al cargar usuarios: ${data.message || data.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('[AdminView] Error al hacer fetch de usuarios:', error);
      setUsuarios([]);
      alert(`Error de conexión: ${error.message}`);
    } finally {
      setLoading(false);
      console.log('[AdminView] Fetch de usuarios finalizado.');
    }
  };

  const handleChange = async (id, campo, valor) => {
    try {
      const usuarioAfectado = usuarios.find(u => u._id === id);
      const usuarioActualizado = { ...usuarioAfectado, [campo]: valor };
      
      const response = await authenticatedRequest(`/api/users/${id}`, { // Usar peticiones autenticadas
        method: 'PUT',
        body: JSON.stringify({
          nombre: usuarioActualizado.nombre,
          correo: usuarioActualizado.correo,
          rol: usuarioActualizado.rol
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsuarios(prev =>
          prev.map(user =>
            user._id === id ? { ...user, ...updatedUser } : user
          )
        );
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  const createUser = async () => {
    console.log('[AdminView] Iniciando creación de usuario:', newUser);
    
    // Validar campos requeridos
    if (!newUser.nombre || !newUser.correo || !newUser.contraseña) {
      alert('Todos los campos son obligatorios');
      return;
    }
    
    try {
      console.log('[AdminView] Enviando petición POST a /api/users...');
      const response = await authenticatedRequest('/api/users', { // Usar peticiones autenticadas
        method: 'POST',
        body: JSON.stringify(newUser)
      });
      
      console.log('[AdminView] Respuesta de creación:', response.status, response.statusText);
      const responseData = await response.json();
      console.log('[AdminView] Datos de respuesta:', responseData);

      if (response.ok) {
        console.log('[AdminView] Usuario creado exitosamente');
        setUsuarios(prev => [...prev, responseData]);
        setNewUser({ nombre: '', correo: '', rol: 'usuario', contraseña: '' });
        setShowCreateForm(false);
        alert('Usuario creado exitosamente');
        // Recargar la lista de usuarios
        fetchUsuarios();
      } else {
        console.error('[AdminView] Error al crear usuario:', responseData);
        alert(responseData.error || responseData.message || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('[AdminView] Error en createUser:', error);
      alert(`Error de conexión al crear usuario: ${error.message}`);
    }
  };

  const handleLogout = () => {
    logout(); // Usar la función de logout del contexto
    navigate("/login");
  };

  console.log(`[AdminView] Renderizando... Loading: ${loading}, Usuarios: ${usuarios.length}`);
  
  if (user?.rol !== 'admin') {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
        <p className="mb-6">Necesitas ser administrador para ver esta página.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-semibold"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  // Si el usuario es admin, mostrar el panel de gestión
  return (
    <div className="min-h-screen bg-dark-900 text-black px-8 py-10">
      <div className="max-w-6xl mx-auto p-8 rounded shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Panel de Administración - {user.nombre}
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Gestión de Usuarios</h3>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
            >
              {showCreateForm ? 'Cancelar' : 'Crear Usuario'}
            </button>
          </div>

          {/* Formulario para crear usuario */}
          {showCreateForm && (
            <div className="bg-gray-800 p-6 rounded-lg mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">Crear Nuevo Usuario</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Nombre</label>
                  <input
                    type="text"
                    value={newUser.nombre}
                    onChange={(e) => setNewUser({...newUser, nombre: e.target.value})}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                    placeholder="Ingrese el nombre completo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Correo</label>
                  <input
                    type="email"
                    value={newUser.correo}
                    onChange={(e) => setNewUser({...newUser, correo: e.target.value})}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Rol</label>
                  <select
                    value={newUser.rol}
                    onChange={(e) => setNewUser({...newUser, rol: e.target.value})}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                    <option value="gestor">Gestor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={newUser.contraseña}
                    onChange={(e) => setNewUser({...newUser, contraseña: e.target.value})}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
              </div>
              <div className="text-right mt-4">
                <button
                  onClick={createUser}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
                >
                  Guardar Usuario
                </button>
              </div>
            </div>
          )}

          {/* Tabla de usuarios */}
          {loading ? (
            <p className="text-white text-center">Cargando usuarios...</p>
          ) : (
            <div className="overflow-x-auto bg-gray-800 rounded-lg">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="py-3 px-4 text-left text-white font-semibold">ID</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Nombre</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Correo</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Rol</th>
                    <th className="py-3 px-4 text-left text-white font-semibold">Fecha de Creación</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u, index) => (
                    <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-600">
                      <td className="py-2 px-4 text-white">{index + 1}</td>
                      <td className="py-2 px-4 text-white">
                        <input
                          type="text"
                          value={u.nombre}
                          onChange={(e) => handleChange(u._id, 'nombre', e.target.value)}
                          className="bg-gray-700 text-white rounded p-1 w-full border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-2 px-4 text-white">
                        <input
                          type="email"
                          value={u.correo}
                          onChange={(e) => handleChange(u._id, 'correo', e.target.value)}
                          className="bg-gray-700 text-white rounded p-1 w-full border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-2 px-4 text-white">
                        <select
                          value={u.rol}
                          onChange={(e) => handleChange(u._id, 'rol', e.target.value)}
                          className="bg-gray-700 text-white rounded p-1 w-full border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="usuario">Usuario</option>
                          <option value="admin">Administrador</option>
                          <option value="gestor">Gestor</option>
                        </select>
                      </td>
                      <td className="py-2 px-4 text-white">
                        {new Date(u.createdAt).toLocaleDateString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default AdminView;
