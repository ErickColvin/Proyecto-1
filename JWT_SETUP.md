# 🔐 Implementación JWT - Plataforma Digital

## ¿Qué se implementó?

Se integró un sistema completo de autenticación JWT (JSON Web Tokens) para mantener sesiones seguras y autenticar usuarios con MongoDB.

## 🚀 Funcionalidades Implementadas

### Backend (Servidor)
- ✅ **Autenticación JWT**: Tokens seguros con expiración de 7 días
- ✅ **Hash de contraseñas**: Usando bcrypt con 12 rounds de salt
- ✅ **Middleware de autenticación**: Validación automática de tokens
- ✅ **Control de roles**: Middleware para restricciones por rol
- ✅ **Rutas protegidas**: APIs que requieren autenticación

### Frontend (React)
- ✅ **Contexto de autenticación**: Manejo centralizado del estado
- ✅ **Persistencia de sesión**: Tokens guardados en localStorage
- ✅ **Verificación automática**: Validación de tokens al cargar la app
- ✅ **Hook personalizado**: `useApi()` para peticiones autenticadas
- ✅ **Manejo de errores**: Logout automático con tokens expirados

## 📁 Archivos Creados/Modificados

### Nuevos Archivos
```
server/
├── middleware/auth.js          # Middleware JWT
├── routes/auth.js             # Rutas de autenticación
└── scripts/migratePasswords.js # Script de migración

frontend/
└── src/hooks/useApi.js        # Hook para peticiones autenticadas
```

### Archivos Modificados
```
server/
├── index.js                   # Rutas protegidas + imports
├── package.json              # Script de migración
└── models/User.js            # (Ya existía)

frontend/
└── src/context/AuthContext.jsx # JWT implementation
```

## 🔗 Endpoints Disponibles

### Autenticación
```
POST /api/auth/login          # Iniciar sesión
POST /api/auth/register       # Registrar usuario
POST /api/auth/verify-token   # Verificar token
GET  /api/auth/me            # Datos del usuario actual
```

### APIs Protegidas
```
GET  /api/users     # Solo admins - Lista usuarios
PUT  /api/users/:id # Solo admins - Actualizar usuario  
POST /api/users     # Solo admins - Crear usuario
```

## 🔧 Configuración

### 1. Variables de Entorno
Crear archivo `.env` en `/server/`:
```env
# Configuración JWT
JWT_SECRET=mi_clave_secreta_super_segura_para_jwt_2024_proyecto_plataforma_digital

# Base de datos
MONGODB_URI=mongodb://localhost:27017/plataforma_digital

# Puerto
PORT=3000
```

### 2. Dependencias Instaladas
```bash
# En /server/
npm install jsonwebtoken bcryptjs
```

## 🏃‍♂️ Cómo usar

### 1. Migrar contraseñas existentes
```bash
cd server
npm run migrate-passwords
```

### 2. Iniciar el servidor
```bash
cd server
npm run dev
```

### 3. Iniciar el frontend
```bash
cd my-digital-platform
npm run dev
```

## 🔐 Credenciales de prueba

Las credenciales existentes siguen funcionando:

```
👨‍💼 Administrador:
- Email: juan@correo.com
- Contraseña: admin123

👤 Usuario - María:
- Email: maria@correo.com  
- Contraseña: maria456

👤 Usuario - Carlos:
- Email: carlos@correo.com
- Contraseña: carlos789
```

## 🛡️ Seguridad Implementada

1. **Contraseñas hasheadas**: bcrypt con 12 rounds
2. **Tokens JWT seguros**: Firmados con clave secreta
3. **Expiración automática**: Tokens válidos por 7 días
4. **Validación automática**: Middleware en todas las rutas protegidas
5. **Control de roles**: Restricciones por tipo de usuario
6. **Logout seguro**: Limpieza completa del estado

## 🔄 Flujo de Autenticación

1. **Login**: Usuario envía credenciales → Servidor valida → Genera JWT
2. **Storage**: Token se guarda en localStorage del navegador
3. **Requests**: Cada petición incluye token en header Authorization
4. **Validation**: Middleware verifica token en cada request
5. **Refresh**: Frontend verifica token al cargar la app
6. **Logout**: Se elimina token y se limpia estado

## 🚨 Manejo de Errores

- **Token expirado**: Logout automático + redirección a login
- **Token inválido**: Logout automático + mensaje de error
- **Sin permisos**: Error 403 con mensaje explicativo
- **Sin token**: Error 401 solicitando autenticación

## 📝 Ejemplo de uso en Frontend

```javascript
import { useApi } from '../hooks/useApi';

const MyComponent = () => {
  const api = useApi();
  
  const fetchUsers = async () => {
    try {
      const users = await api.get('/users');
      console.log(users);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  
  return <button onClick={fetchUsers}>Obtener usuarios</button>;
};
```

¡El sistema JWT está completamente funcional y listo para usar! 🎉 