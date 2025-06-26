import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Generar token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'tu_clave_secreta_super_segura',
    { expiresIn: '7d' } // Token válido por 7 días
  );
};

// POST /api/auth/login - Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email
    const user = await User.findOne({ 
      correo: email.toLowerCase(),
      activo: true 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña (comparación directa)
    const isValidPassword = user.contraseña === password;
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = generateToken(user._id);

    // Respuesta exitosa (sin enviar la contraseña)
    const userResponse = {
      _id: user._id,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
      fechaRegistro: user.fechaRegistro
    };

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol = 'usuario' } = req.body;

    // Validar campos requeridos
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Validar longitud de contraseña
    if (contraseña.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ correo: correo.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear nuevo usuario (contraseña en texto plano)
    const newUser = new User({
      nombre,
      correo: correo.toLowerCase(),
      contraseña: contraseña, // Guardar directamente
      rol,
      activo: true
    });

    const savedUser = await newUser.save();

    // Generar token JWT
    const token = generateToken(savedUser._id);

    // Respuesta exitosa
    const userResponse = {
      _id: savedUser._id,
      nombre: savedUser.nombre,
      correo: savedUser.correo,
      rol: savedUser.rol,
      fechaRegistro: savedUser.fechaRegistro
    };

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/auth/me - Obtener información del usuario autenticado
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userResponse = {
      _id: req.user._id,
      nombre: req.user.nombre,
      correo: req.user.correo,
      rol: req.user.rol,
      fechaRegistro: req.user.fechaRegistro
    };

    res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/auth/verify-token - Verificar si un token es válido
router.post('/verify-token', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token válido',
    user: {
      _id: req.user._id,
      nombre: req.user.nombre,
      correo: req.user.correo,
      rol: req.user.rol,
      fechaRegistro: req.user.fechaRegistro
    }
  });
});

export default router; 