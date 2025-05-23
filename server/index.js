import express from 'express';
import cors from 'cors';
import multer from 'multer';
import xlsx from 'xlsx';

const app = express();
app.use(cors());
app.use(express.json());

// Usamos multer en memoria
const upload = multer({ storage: multer.memoryStorage() });

// Datos en memoria
let products = [];
let alerts = [];

/**
 * POST /api/upload
 * Recibe archivo Excel, lo parsea y actualiza `products` y `alerts`.
 */
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    // Leemos el workbook desde el buffer
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    // Mapea filas a nuestro modelo
    products = rows.map(r => ({
      // Usa la columna “ID” como identificador
      id: r["ID"],
    
      nombre: r["Nombre Producto"]   || "",
      categoria: r["Categoría"]      || "",
      stock: Number(r["Stock"])      || 0,
      precioUnitario: parseFloat(r["Precio Unitario"]) || 0,
    
      // Fecha Ingreso → objeto Date
      fechaIngreso: r["Fecha Ingreso"]
        ? new Date(r["Fecha Ingreso"])
        : new Date(),
    }));

    // Genera alertas para stock < 10
    alerts = products
      .filter(p => p.stock < 10)
      .map(p => ({
        producto: p.nombre,
        stock: p.stock,
        mensaje: `Stock bajo: ${p.nombre}`,
        createdAt: new Date(),
      }));

    return res.json({ ok: true, count: products.length });
  } catch (err) {
    console.error('Error al procesar Excel:', err);
    return res.status(500).json({ error: 'Error al procesar Excel' });
  }
});

/** GET /api/products → lista de productos */
app.get('/api/products', (req, res) => {
  res.json(products);
});

/** GET /api/alerts → lista de alertas */
app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

// Levanta el servidor en el puerto 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});