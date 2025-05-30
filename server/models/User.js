import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  contraseña: {
    type: String,
    required: true,
    minlength: 6
  },
  rol: {
    type: String,
    required: true,
    enum: ['admin', 'usuario', 'gestor'],
    default: 'usuario'
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual para mapear fechaRegistro al campo createdAt (compatibilidad con diagrama)
userSchema.virtual('fechaRegistro').get(function() {
  return this.createdAt;
});

// Incluir virtuals en JSON
userSchema.set('toJSON', { virtuals: true });

// Índices (correo ya tiene unique: true, no necesita índice manual)
userSchema.index({ rol: 1 });

export default mongoose.model('User', userSchema); 