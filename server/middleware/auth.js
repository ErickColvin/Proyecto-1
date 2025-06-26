import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    console.log('[AUTH] Verificando token para:', req.method, req.path);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log('[AUTH] Token presente:', !!token);

    if (!token) {
      console.log('[AUTH] No se proporcionó token');
      return res.status(401).json({ 
        success: false, 
        message: 'Token de acceso requerido' 
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_super_segura');
    console.log('[AUTH] Token decodificado:', { userId: decoded.userId, rol: decoded.rol });
    
    // Buscar el usuario en la base de datos
    const user = await User.findById(decoded.userId).select('-contraseña');
    console.log('[AUTH] Usuario encontrado:', user ? { id: user._id, nombre: user.nombre, rol: user.rol } : null);
    
    if (!user || !user.activo) {
      console.log('[AUTH] Usuario no válido o inactivo');
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no válido' 
      });
    }

    // Agregar el usuario a la request
    req.user = user;
    console.log('[AUTH] Autenticación exitosa');
    next();
  } catch (error) {
    console.error('[AUTH] Error en autenticación:', error.message);
    return res.status(403).json({ 
      success: false, 
      message: 'Token inválido' 
    });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no autenticado' 
      });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permisos para acceder a este recurso' 
      });
    }

    next();
  };
}; 