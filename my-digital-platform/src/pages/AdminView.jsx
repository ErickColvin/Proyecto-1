import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminView = () => {
  const [usuarioActual, setUsuarioActual] = useState(null);
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

  // Cargar usuarios desde la API
  useEffect(() => {
    if (usuarioActual && usuarioActual.rol === "admin") {
      fetchUsuarios();
    }
  }, [usuarioActual]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (rol) => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const users = await response.json();
        const user = users.find(u => u.rol === rol);
        setUsuarioActual(user);

        if (user && user.rol === "usuario") {
          // Redirigir usuarios normales al dashboard
          navigate("/home");
        }
      }
    } catch (error) {
      console.error('Error al hacer login:', error);
    }
  };

  const handleChange = async (id, campo, valor) => {
    try {
      const usuarioActualizado = { ...usuarios.find(u => u._id === id), [campo]: valor };
      
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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
            user._id === id ? updatedUser : user
          )
        );
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        const createdUser = await response.json();
        setUsuarios(prev => [...prev, createdUser]);
        setNewUser({ nombre: '', correo: '', rol: 'usuario', contraseña: '' });
        setShowCreateForm(false);
        alert('Usuario creado exitosamente');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert('Error al crear usuario');
    }
  };

  const handleLogout = () => {
    setUsuarioActual(null);
    navigate("/dashboard"); // Redirigir al dashboard después de cerrar sesión
  };

  return (
    <div className="min-h-screen bg-dark-900 text-black px-8 py-10">
      {!usuarioActual ? (
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-xl font-semibold mb-6 text-white">
            Panel de Administración
          </h2>
          <p className="text-dark-300 mb-6">
            Acceso restringido - Inicia sesión con credenciales de administrador
          </p>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded mr-4 hover:bg-blue-700 font-semibold"
            onClick={() => handleLogin("admin")}
          >
            Iniciar como Admin
          </button>
          <button
            className="bg-dark-600 text-white px-6 py-3 rounded hover:bg-gray-700"
            onClick={() => navigate("/home")}
          >
            Volver al Dashboard
          </button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-8 rounded shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Panel de Administración - {usuarioActual.nombre}
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/home")}
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

          {usuarioActual.rol === "admin" ? (
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
                        className="w-full p-2 border rounded"
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
                        className="w-full p-2 border rounded"
                        placeholder="correo@ejemplo.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Rol</label>
                      <select
                        value={newUser.rol}
                        onChange={(e) => setNewUser({...newUser, rol: e.target.value})}
                        className="w-full p-2 border rounded"
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
                        className="w-full p-2 border rounded"
                        placeholder="Mínimo 6 caracteres"
                        minLength="6"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={createUser}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      disabled={!newUser.nombre || !newUser.correo || !newUser.contraseña}
                    >
                      Crear Usuario
                    </button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="text-center text-white">Cargando usuarios...</div>
              ) : (
                <div className="bg-dark rounded-lg overflow-hidden">
                  <table className="w-full border">
                    <thead className="bg-dark-200">
                      <tr>
                        <th className="p-2 border font-semibold" style={{color: '#000000'}}>ID</th>
                        <th className="p-2 border font-semibold" style={{color: '#000000'}}>Nombre</th>
                        <th className="p-2 border font-semibold" style={{color: '#000000'}}>Correo</th>
                        <th className="p-2 border font-semibold" style={{color: '#000000'}}>Rol</th>
                        <th className="p-2 border font-semibold" style={{color: '#000000'}}>Fecha de Creación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((u, index) => (
                        <tr key={u._id}>
                          <td className="p-2 border text-center font-medium" style={{color: '#000000'}}>{index + 1}</td>
                          <td className="p-2 border">
                            <input
                              value={u.nombre}
                              onChange={(e) => handleChange(u._id, "nombre", e.target.value)}
                              className="w-full p-1 border rounded"
                              style={{color: '#000000'}}
                            />
                          </td>
                          <td className="p-2 border">
                            <input
                              value={u.correo}
                              onChange={(e) => handleChange(u._id, "correo", e.target.value)}
                              className="w-full p-1 border rounded"
                              style={{color: '#000000'}}
                            />
                          </td>
                          <td className="p-2 border">
                            <select
                              value={u.rol}
                              onChange={(e) => handleChange(u._id, "rol", e.target.value)}
                              className="w-full p-1 border rounded"
                              style={{color: '#000000'}}
                            >
                              <option value="admin">admin</option>
                              <option value="usuario">usuario</option>
                            </select>
                          </td>
                          <td className="p-2 border text-sm" style={{color: '#000000'}}>
                            {new Date(u.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-white">
              <h3 className="text-xl mb-4">Acceso Denegado</h3>
              <p className="mb-4">No tienes permisos de administrador para acceder a esta sección.</p>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
              >
                Volver al Dashboard
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminView;
