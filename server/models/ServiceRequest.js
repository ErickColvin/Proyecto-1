import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
  nombreServicio: {
    type: String,
    required: true,
    trim: true
  },
  servicioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicio',
    required: false // Opcional por si se crea la solicitud antes del servicio
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    required: true,
    enum: ['pendiente', 'en_proceso', 'completado', 'cancelado', 'pausado'],
    default: 'pendiente'
  },
  prioridad: {
    type: String,
    enum: ['baja', 'media', 'alta', 'urgente'],
    default: 'media'
  },
  usuarioSolicitante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  observaciones: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Validación personalizada para fechas
serviceRequestSchema.pre('save', function(next) {
  if (this.fechaFin <= this.fechaInicio) {
    next(new Error('La fecha de fin debe ser posterior a la fecha de inicio'));
  } else {
    next();
  }
});

// Índices para mejorar el rendimiento
serviceRequestSchema.index({ nombreServicio: 1 });
serviceRequestSchema.index({ servicioId: 1 });
serviceRequestSchema.index({ estado: 1 });
serviceRequestSchema.index({ fechaInicio: 1 });
serviceRequestSchema.index({ fechaFin: 1 });
serviceRequestSchema.index({ prioridad: 1 });
serviceRequestSchema.index({ usuarioSolicitante: 1 });

export default mongoose.model('ServiceRequest', serviceRequestSchema); 