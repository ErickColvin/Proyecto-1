# 🚀 Plataforma de Gestión de Inventario con MongoDB Atlas

## 📋 Requisitos Previos

1. **Node.js** instalado (versión 16 o superior)
2. **Cuenta en MongoDB Atlas** configurada
3. **Archivo .env** configurado en la carpeta `server`

## ⚙️ Configuración Inicial

### 1. Configurar MongoDB Atlas

1. Crear cuenta en [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crear un cluster gratuito (M0)
3. Configurar Network Access (permitir tu IP o 0.0.0.0/0 para desarrollo)
4. Crear usuario de base de datos
5. Obtener cadena de conexión

### 2. Configurar archivo .env

Crear archivo `.env` en la carpeta `server` con:

```env
# Configuración de MongoDB Atlas
MONGODB_URI=mongodb+srv://<usuario>:<clave>@tucluster.xxxxx.mongodb.net/inventario-db?retryWrites=true&w=majority

# Puerto del servidor
PORT=3001

# Configuración adicional
NODE_ENV=development
```

**⚠️ IMPORTANTE**: Reemplaza `tuusuario`, `tupassword` y `tucluster` con tus datos reales de MongoDB Atlas.

## 🚀 Cómo Iniciar la Aplicación

### Opción 1: Iniciar todo automáticamente (RECOMENDADO)

```bash
# Desde el directorio raíz del proyecto
npm run dev
```

### Opción 2: Iniciar manualmente

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend (en otra terminal)
cd my-digital-platform
npm run dev
```

## 🌐 URLs de la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Panel Admin**: http://localhost:5173/admin

## 🔧 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- Verificar que el archivo `.env` está configurado correctamente
- Verificar que tu IP está permitida en MongoDB Atlas
- Verificar usuario y contraseña de la base de datos

### Error: "Port already in use"
- Cerrar aplicaciones que usen los puertos 3001 o 5173
- En Windows: `netstat -ano | findstr :3001` para ver qué proceso usa el puerto

### Error: "Module not found"
- Ejecutar `npm install` en ambas carpetas (`server` y `my-digital-platform`)

## 📁 Estructura del Proyecto

```
Proyecto-1-master/
├── server/                 # Backend (Express + MongoDB)
│   ├── models/            # Modelos de MongoDB
│   ├── config/            # Configuración de BD
│   ├── .env              # Variables de entorno
│   └── index.js          # Servidor principal
├── my-digital-platform/   # Frontend (React)
│   ├── src/
│   └── vite.config.js    # Configuración de Vite
└── package.json          # Scripts principales
```

## 🎯 Funcionalidades

- ✅ Gestión de usuarios con roles (admin/usuario)
- ✅ Importación de productos desde Excel
- ✅ Sistema de alertas de stock bajo
- ✅ Persistencia en MongoDB Atlas
- ✅ API REST para todas las operaciones

## 🔄 Comandos Útiles

```bash
# Instalar todas las dependencias
npm run install-all

# Solo backend
npm run server

# Solo frontend
npm run client

# Ambos simultáneamente
npm run dev
``` 