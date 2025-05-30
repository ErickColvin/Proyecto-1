import express from 'express';
import cors from 'cors';
import multer from 'multer';
import xlsx from 'xlsx';
import dotenv from 'dotenv';

// Importar configuración de base de datos
import connectDB from './config/database.js';
import { seedDatabase } from './config/seed.js';

// Importar modelos existentes
import Product from './models/Product.js';
import User from './models/User.js';
import Alert from './models/Alert.js';

// Importar nuevos modelos para DataUp
import Servicio from './models/Servicio.js';
import HistorialError from './models/HistorialError.js';
import Reporte from './models/Reporte.js';
import ServiceRequest from './models/ServiceRequest.js';

// Cargar variables de entorno
dotenv.config();
import router from './HU9-Services/services.route.js';

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Usamos multer en memoria
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/upload
 * Recibe archivo Excel, lo parsea y actualiza productos y alertas en MongoDB.
 */
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    // Leer el workbook desde el buffer
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    // Limpiar productos existentes (opcional)
    await Product.deleteMany({});
    await Alert.deleteMany({});

    // Mapear filas a productos
    const products = rows.map(r => ({
      nombre: r["Nombre Producto"] || "",
      categoria: r["Categoría"] || "",
      stock: Number(r["Stock"]) || 0,
      precioUnitario: parseFloat(r["Precio Unitario"]) || 0,
      fechaIngreso: r["Fecha Ingreso"] ? new Date(r["Fecha Ingreso"]) : new Date(),
    }));

    // Insertar productos en MongoDB
    const savedProducts = await Product.insertMany(products);

    // Generar alertas para stock < 10
    const lowStockProducts = savedProducts.filter(p => p.stock < 10);
    const alerts = lowStockProducts.map(p => ({
      producto: p.nombre,
      stock: p.stock,
      mensaje: `Stock bajo: ${p.nombre}`,
      productId: p._id,
      tipo: 'stock_bajo'
    }));

    if (alerts.length > 0) {
      await Alert.insertMany(alerts);
    }

    return res.json({ 
      ok: true, 
      count: savedProducts.length,
      alertsGenerated: alerts.length 
    });
  } catch (err) {
    console.error('Error al procesar Excel:', err);
    return res.status(500).json({ error: 'Error al procesar Excel' });
  }
});

app.use('/api/services', router);

/** GET /api/products → lista de productos */
app.get('/api/products', (req, res) => {
  res.json(products);
});

/** GET /api/alerts → lista de alertas desde MongoDB */
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find().populate('productId').sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
});

/** GET /api/users → lista de usuarios */
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({ activo: true }).sort({ nombre: 1 });
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

/** PUT /api/users/:id → actualizar usuario */
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, rol } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { nombre, correo, rol },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// =================== NUEVAS APIs PARA DataUp ===================

/** SERVICIOS */
// GET /api/servicios
app.get('/api/servicios', async (req, res) => {
  try {
    const servicios = await Servicio.find({ activo: true }).sort({ nombreServicio: 1 });
    res.json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
});

// POST /api/servicios
app.post('/api/servicios', async (req, res) => {
  try {
    const { nombreServicio, descripcion } = req.body;
    const nuevoServicio = new Servicio({ nombreServicio, descripcion });
    const servicioGuardado = await nuevoServicio.save();
    res.status(201).json(servicioGuardado);
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
});

// PUT /api/servicios/:id
app.put('/api/servicios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreServicio, descripcion, activo } = req.body;
    
    const servicioActualizado = await Servicio.findByIdAndUpdate(
      id,
      { nombreServicio, descripcion, activo },
      { new: true, runValidators: true }
    );
    
    if (!servicioActualizado) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json(servicioActualizado);
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
});

/** HISTORIAL DE ERRORES */
// GET /api/historial-errores
app.get('/api/historial-errores', async (req, res) => {
  try {
    const { modulo, resuelto, limite = 50 } = req.query;
    let filtro = {};
    
    if (modulo) filtro.modulo = modulo;
    if (resuelto !== undefined) filtro.resuelto = resuelto === 'true';
    
    const errores = await HistorialError.find(filtro)
      .populate('idUsuario', 'nombre correo')
      .sort({ fechaError: -1 })
      .limit(parseInt(limite));
    
    res.json(errores);
  } catch (error) {
    console.error('Error al obtener historial de errores:', error);
    res.status(500).json({ error: 'Error al obtener historial de errores' });
  }
});

// POST /api/historial-errores
app.post('/api/historial-errores', async (req, res) => {
  try {
    const { idUsuario, modulo, mensajeError, tipoError } = req.body;
    const nuevoError = new HistorialError({
      idUsuario,
      modulo,
      mensajeError,
      tipoError
    });
    const errorGuardado = await nuevoError.save();
    res.status(201).json(errorGuardado);
  } catch (error) {
    console.error('Error al registrar error:', error);
    res.status(500).json({ error: 'Error al registrar error' });
  }
});

// PUT /api/historial-errores/:id/resolver
app.put('/api/historial-errores/:id/resolver', async (req, res) => {
  try {
    const { id } = req.params;
    const errorResuelto = await HistorialError.findByIdAndUpdate(
      id,
      { resuelto: true },
      { new: true }
    );
    
    if (!errorResuelto) {
      return res.status(404).json({ error: 'Error no encontrado' });
    }
    
    res.json(errorResuelto);
  } catch (error) {
    console.error('Error al resolver error:', error);
    res.status(500).json({ error: 'Error al resolver error' });
  }
});

/** REPORTES */
// GET /api/reportes
app.get('/api/reportes', async (req, res) => {
  try {
    const { estado, tipoArchivo } = req.query;
    let filtro = {};
    
    if (estado) filtro.estado = estado;
    if (tipoArchivo) filtro.tipoArchivo = tipoArchivo;
    
    const reportes = await Reporte.find(filtro)
      .populate('idGestor', 'nombre correo')
      .sort({ fechaGeneracion: -1 });
    
    res.json(reportes);
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

// POST /api/reportes
app.post('/api/reportes', async (req, res) => {
  try {
    const {
      idGestor,
      tipoArchivo,
      rangoFechaInicio,
      rangoFechaFin,
      totalSolicitudes,
      descripcion
    } = req.body;
    
    const nuevoReporte = new Reporte({
      idGestor,
      tipoArchivo,
      rangoFechaInicio,
      rangoFechaFin,
      totalSolicitudes,
      descripcion
    });
    
    const reporteGuardado = await nuevoReporte.save();
    res.status(201).json(reporteGuardado);
  } catch (error) {
    console.error('Error al crear reporte:', error);
    res.status(500).json({ error: 'Error al crear reporte' });
  }
});

/** SOLICITUDES DE SERVICIO */
// GET /api/service-requests
app.get('/api/service-requests', async (req, res) => {
  try {
    const { estado, prioridad, nombreServicio } = req.query;
    let filtro = {};
    
    if (estado) filtro.estado = estado;
    if (prioridad) filtro.prioridad = prioridad;
    if (nombreServicio) filtro.nombreServicio = new RegExp(nombreServicio, 'i');
    
    const solicitudes = await ServiceRequest.find(filtro)
      .populate('servicioId', 'nombreServicio descripcion')
      .populate('usuarioSolicitante', 'nombre correo')
      .sort({ fechaInicio: -1 });
    
    res.json(solicitudes);
  } catch (error) {
    console.error('Error al obtener solicitudes de servicio:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes de servicio' });
  }
});

// POST /api/service-requests
app.post('/api/service-requests', async (req, res) => {
  try {
    const {
      nombreServicio,
      servicioId,
      direccion,
      descripcion,
      fechaInicio,
      fechaFin,
      prioridad,
      usuarioSolicitante,
      observaciones
    } = req.body;
    
    const nuevaSolicitud = new ServiceRequest({
      nombreServicio,
      servicioId,
      direccion,
      descripcion,
      fechaInicio,
      fechaFin,
      prioridad,
      usuarioSolicitante,
      observaciones
    });
    
    const solicitudGuardada = await nuevaSolicitud.save();
    res.status(201).json(solicitudGuardada);
  } catch (error) {
    console.error('Error al crear solicitud de servicio:', error);
    res.status(500).json({ error: 'Error al crear solicitud de servicio' });
  }
});

// PUT /api/service-requests/:id/estado
app.put('/api/service-requests/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, observaciones } = req.body;
    
    const solicitudActualizada = await ServiceRequest.findByIdAndUpdate(
      id,
      { estado, observaciones },
      { new: true, runValidators: true }
    );
    
    if (!solicitudActualizada) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    res.json(solicitudActualizada);
  } catch (error) {
    console.error('Error al actualizar estado de solicitud:', error);
    res.status(500).json({ error: 'Error al actualizar estado de solicitud' });
  }
});

// Función para inicializar la aplicación
const startServer = async () => {
  try {
    // Conectar a MongoDB
    const connection = await connectDB();
    
    // Solo inicializar datos si hay conexión exitosa
    if (connection) {
      await seedDatabase();
      console.log('✅ Base de datos inicializada correctamente');
    } else {
      console.log('⚠️  Ejecutando en modo sin base de datos');
    }
    
    // Iniciar servidor (siempre, con o sin DB)
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📁 Endpoints disponibles:`);
      console.log(`   GET  /api/products`);
      console.log(`   GET  /api/alerts`);
      console.log(`   GET  /api/users`);
      console.log(`   POST /api/upload`);
      console.log(`   PUT  /api/users/:id`);
      console.log(`   GET  /api/servicios`);
      console.log(`   POST /api/servicios`);
      console.log(`   PUT  /api/servicios/:id`);
      console.log(`   GET  /api/historial-errores`);
      console.log(`   POST /api/historial-errores`);
      console.log(`   PUT  /api/historial-errores/:id/resolver`);
      console.log(`   GET  /api/reportes`);
      console.log(`   POST /api/reportes`);
      console.log(`   GET  /api/service-requests`);
      console.log(`   POST /api/service-requests`);
      console.log(`   PUT  /api/service-requests/:id/estado`);
      
      if (!connection) {
        console.log(`\n⚠️  ADVERTENCIA: Ejecutando sin base de datos`);
        console.log(`   Las operaciones de DB retornarán errores 500`);
        console.log(`   Para solucionar: configurar MongoDB correctamente`);
      }
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    
    // Intentar iniciar servidor sin DB como último recurso
    console.log('🔄 Intentando iniciar servidor sin base de datos...');
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor iniciado en modo de emergencia en http://localhost:${PORT}`);
      console.log(`⚠️  Funcionalidad de base de datos no disponible`);
    });
  }
};

// Iniciar la aplicación
startServer();