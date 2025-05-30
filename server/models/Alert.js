import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  producto: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  mensaje: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['stock_bajo', 'vencimiento', 'reorden'],
    default: 'stock_bajo'
  },
  leida: {
    type: Boolean,
    default: false
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }
}, {
  timestamps: true
});

// Índices
alertSchema.index({ leida: 1 });
alertSchema.index({ tipo: 1 });
alertSchema.index({ createdAt: -1 });

export default mongoose.model('Alert', alertSchema); 