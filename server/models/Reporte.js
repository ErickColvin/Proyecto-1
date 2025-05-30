import mongoose from 'mongoose';

const reporteSchema = new mongoose.Schema({
  idGestor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tipoArchivo: {
    type: String,
    required: true,
    enum: ['PDF', 'Excel', 'CSV', 'Word'],
    default: 'PDF'
  },
  fechaGeneracion: {
    type: Date,
    default: Date.now,
    required: true
  },
  rangoFechaInicio: {
    type: Date,
    required: true
  },
  rangoFechaFin: {
    type: Date,
    required: true
  },
  totalSolicitudes: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  nombreArchivo: {
    type: String,
    trim: true
  },
  estado: {
    type: String,
    enum: ['generando', 'completado', 'error'],
    default: 'generando'
  },
  descripcion: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento
reporteSchema.index({ idGestor: 1 });
reporteSchema.index({ fechaGeneracion: -1 });
reporteSchema.index({ tipoArchivo: 1 });
reporteSchema.index({ estado: 1 });
reporteSchema.index({ rangoFechaInicio: 1, rangoFechaFin: 1 });

export default mongoose.model('Reporte', reporteSchema); 