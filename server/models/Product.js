import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  fechaIngreso: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Índices para mejorar el rendimiento
productSchema.index({ nombre: 1 });
productSchema.index({ categoria: 1 });
productSchema.index({ stock: 1 });

export default mongoose.model('Product', productSchema); 