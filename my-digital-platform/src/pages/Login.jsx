import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Si ya está autenticado, redirigir al dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login({ email: correo, password: contraseña });
      
      if (result.success) {
        // Redirigir según el rol
        if (result.user.rol === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(result.message || "Error al iniciar sesión");
      }
    } catch (error) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Iniciar sesión
        </h2>
        
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <label className="block mb-2">Correo electrónico</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          required
        />

        <label className="block mb-2">Contraseña</label>
        <input
          type="password"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          className="w-full p-2 mb-6 rounded bg-gray-700 text-white"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>

        <div className="mt-6 p-4 bg-gray-700 rounded text-sm">
          <p className="font-semibold mb-3 text-center">Credenciales de Acceso</p>
          
          <div className="space-y-3">
            <div className="bg-gray-600 p-3 rounded">
              <p className="font-medium text-blue-300">👨‍💼 Administrador</p>
              <p>📧 Correo: <span className="text-yellow-300">juan@correo.com</span></p>
              <p>🔑 Contraseña: <span className="text-yellow-300">admin123</span></p>
            </div>
            
            <div className="bg-gray-600 p-3 rounded">
              <p className="font-medium text-green-300">👤 Usuario - María</p>
              <p>📧 Correo: <span className="text-yellow-300">maria@correo.com</span></p>
              <p>🔑 Contraseña: <span className="text-yellow-300">maria456</span></p>
            </div>
            
            <div className="bg-gray-600 p-3 rounded">
              <p className="font-medium text-green-300">👤 Usuario - Carlos</p>
              <p>📧 Correo: <span className="text-yellow-300">carlos@correo.com</span></p>
              <p>🔑 Contraseña: <span className="text-yellow-300">carlos789</span></p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
