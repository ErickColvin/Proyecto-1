import mongoose from 'mongoose';

const historialErrorSchema = new mongoose.Schema({
  idUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  modulo: {
    type: String,
    required: true,
    trim: true
  },
  mensajeError: {
    type: String,
    required: true,
    trim: true
  },
  fechaError: {
    type: Date,
    default: Date.now,
    required: true
  },
  tipoError: {
    type: String,
    enum: ['sistema', 'usuario', 'red', 'base_datos', 'validacion'],
    default: 'sistema'
  },
  resuelto: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento
historialErrorSchema.index({ idUsuario: 1 });
historialErrorSchema.index({ modulo: 1 });
historialErrorSchema.index({ fechaError: -1 });
historialErrorSchema.index({ tipoError: 1 });
historialErrorSchema.index({ resuelto: 1 });

export default mongoose.model('HistorialError', historialErrorSchema); 