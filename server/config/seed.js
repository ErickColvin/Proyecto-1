import User from '../models/User.js';
import Product from '../models/Product.js';
import Servicio from '../models/Servicio.js';
import HistorialError from '../models/HistorialError.js';
import Reporte from '../models/Reporte.js';
import ServiceRequest from '../models/ServiceRequest.js';

// Datos iniciales de usuarios con contraseñas específicas
const initialUsers = [
  {
    nombre: "Juan Pérez",
    correo: "juan@correo.com",
    contraseña: "admin123",
    rol: "admin"
  },
  {
    nombre: "María Gómez",
    correo: "maria@correo.com",
    contraseña: "maria456",
    rol: "usuario"
  },
  {
    nombre: "Carlos Soto",
    correo: "carlos@correo.com",
    contraseña: "carlos789",
    rol: "usuario"
  }
];

// Datos iniciales de productos (ejemplos)
const initialProducts = [
  {
    nombre: "Laptop Dell XPS 13",
    categoria: "Computadoras",
    stock: 15,
    precioUnitario: 1200.00,
    fechaIngreso: new Date()
  },
  {
    nombre: "Mouse Logitech MX",
    categoria: "Periféricos",
    stock: 8,
    precioUnitario: 80.00,
    fechaIngreso: new Date()
  },
  {
    nombre: "Monitor Samsung 24\"",
    categoria: "Monitores",
    stock: 5,
    precioUnitario: 250.00,
    fechaIngreso: new Date()
  },
  {
    nombre: "Teclado Mecánico",
    categoria: "Periféricos",
    stock: 3,
    precioUnitario: 120.00,
    fechaIngreso: new Date()
  }
];

// Datos iniciales de servicios
const initialServicios = [
  {
    nombreServicio: "Limpieza General",
    descripcion: "Servicio de limpieza integral para hogares y oficinas"
  },
  {
    nombreServicio: "Mantenimiento Eléctrico",
    descripcion: "Instalación y reparación de sistemas eléctricos"
  },
  {
    nombreServicio: "Plomería",
    descripcion: "Servicios de plomería y fontanería"
  },
  {
    nombreServicio: "Jardinería",
    descripcion: "Cuidado y mantenimiento de jardines"
  }
];

export const seedDatabase = async () => {
  try {
    // Limpiar usuarios existentes para recrear con contraseñas
    await User.deleteMany({});
    console.log('🗑️ Usuarios existentes eliminados');
    
    // Crear usuarios con contraseñas
    const usuarios = await User.insertMany(initialUsers);
    console.log('✅ Usuarios con contraseñas creados');

    // Verificar productos
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(initialProducts);
      console.log('✅ Productos iniciales creados');
    }

    // Verificar servicios
    const servicioCount = await Servicio.countDocuments();
    if (servicioCount === 0) {
      const servicios = await Servicio.insertMany(initialServicios);
      console.log('✅ Servicios iniciales creados');

      // Crear algunas solicitudes de servicio de ejemplo
      const solicitudesEjemplo = [
        {
          nombreServicio: "Limpieza General",
          servicioId: servicios[0]._id,
          direccion: "Av. Principal 123, Ciudad",
          descripcion: "Limpieza completa de oficina de 3 pisos",
          fechaInicio: new Date(),
          fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días después
          estado: "pendiente",
          prioridad: "media",
          usuarioSolicitante: usuarios[1]._id,
          observaciones: "Preferiblemente en horario de oficina"
        },
        {
          nombreServicio: "Mantenimiento Eléctrico",
          servicioId: servicios[1]._id,
          direccion: "Calle Secundaria 456, Ciudad",
          descripcion: "Revisión del sistema eléctrico completo",
          fechaInicio: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 días después
          fechaFin: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 días después
          estado: "en_proceso",
          prioridad: "alta",
          usuarioSolicitante: usuarios[2]._id
        }
      ];

      await ServiceRequest.insertMany(solicitudesEjemplo);
      console.log('✅ Solicitudes de servicio de ejemplo creadas');

      // Crear algunos reportes de ejemplo
      const reportesEjemplo = [
        {
          idGestor: usuarios[0]._id, // Admin
          tipoArchivo: "PDF",
          rangoFechaInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 días atrás
          rangoFechaFin: new Date(),
          totalSolicitudes: 25,
          estado: "completado",
          descripcion: "Reporte mensual de solicitudes de servicio"
        }
      ];

      await Reporte.insertMany(reportesEjemplo);
      console.log('✅ Reportes de ejemplo creados');

      // Crear algunos errores de ejemplo en el historial
      const erroresEjemplo = [
        {
          idUsuario: usuarios[1]._id,
          modulo: "Servicios",
          mensajeError: "Error al conectar con el proveedor de limpieza",
          tipoError: "red",
          resuelto: true
        },
        {
          idUsuario: usuarios[2]._id,
          modulo: "Reportes",
          mensajeError: "Error al generar reporte PDF",
          tipoError: "sistema",
          resuelto: false
        }
      ];

      await HistorialError.insertMany(erroresEjemplo);
      console.log('✅ Historial de errores de ejemplo creado');
    }

    console.log('🌱 Base de datos DataUp inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  }
}; 