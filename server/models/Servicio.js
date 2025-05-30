import mongoose from 'mongoose';

const servicioSchema = new mongoose.Schema({
  nombreServicio: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Índices para mejorar el rendimiento (nombreServicio ya tiene unique: true)
servicioSchema.index({ activo: 1 });

export default mongoose.model('Servicio', servicioSchema); 