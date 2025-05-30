import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const connectDB = async () => {
  try {
    // Obtener la URI de MongoDB desde variables de entorno
    let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/DataUp';
    
    // Asegurar que se use la base de datos DataUp
    if (mongoUri.includes('mongodb+srv://') || mongoUri.includes('mongodb://')) {
      // Si es Atlas o local, asegurar que termine con /DataUp
      if (!mongoUri.includes('/DataUp')) {
        // Remover cualquier nombre de DB existente y agregar DataUp
        mongoUri = mongoUri.replace(/\/[^/?]*(\?|$)/, '/DataUp$1');
      }
    }
    
    console.log(`🔄 Conectando a base de datos: DataUp`);
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // 5 segundos timeout
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    
    // Verificar que estamos en la base de datos correcta
    if (conn.connection.name !== 'DataUp') {
      console.log(`⚠️  Advertencia: Conectado a "${conn.connection.name}" pero esperábamos "DataUp"`);
    }
    
    return conn;
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
    
    // Si es error de conexión local, intentar con base de datos en memoria
    if (error.message.includes('ECONNREFUSED') || error.message.includes('localhost')) {
      console.log('\n🔄 Intentando conexión con base de datos en memoria...');
      
      try {
        // Usar MongoDB Memory Server como fallback
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = new MongoMemoryServer();
        await mongod.start();
        const uri = mongod.getUri();
        
        const conn = await mongoose.connect(uri + 'DataUp');
        
        console.log('✅ Conectado a base de datos en memoria');
        console.log('📊 Base de datos: DataUp (en memoria)');
        console.log('⚠️  Los datos se perderán al reiniciar el servidor');
        
        return conn;
      } catch (memoryError) {
        console.log('\n💡 Soluciones sugeridas:');
        console.log('1. Instalar MongoDB local: https://www.mongodb.com/try/download/community');
        console.log('2. O usar MongoDB Atlas: https://cloud.mongodb.com/');
        console.log('3. O actualizar el archivo .env con una URI válida');
        console.log('4. O instalar mongodb-memory-server: npm install mongodb-memory-server\n');
        
        // Como último recurso, continuar sin base de datos
        console.log('⚠️  Continuando sin base de datos - funcionalidad limitada');
        return null;
      }
    }
    
    throw error;
  }
};

// Manejar eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose desconectado de MongoDB');
});

// Cerrar conexión cuando la app se cierre
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 Conexión de MongoDB cerrada debido a la terminación de la app');
  process.exit(0);
});

export default connectDB; 