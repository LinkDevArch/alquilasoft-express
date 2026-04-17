# 🧪 Guía de Pruebas APIDog / Postman (Datos Pre-Sembrados)

Esta guía usa **UUIDs fijos**. Esto significa que si corriste el script de seeding (`pnpm seed:test`), **no necesitas reemplazar ningún ID**. Solo copia el JSON y pega en APIDog. Todo funcionará directamente.

---

## 1. 🛡️ Autenticación y Onboarding

### 1.1 Login con Admin Pre-sembrado (Usa este para sacar el token)
- **Método:** `POST`
- **URL:** `/api/v1/auth/login`
- **Auth:** Ninguna
```json
{
  "email": "admin@demo.com",
  "password": "password123"
}
```
*(Copia el `token` y ponlo globalmente en APIDog para las demás peticiones).*

---

## 2. 👥 Gestión de Usuarios

### 2.1 Crear un Empleado Nuevo
- **Método:** `POST`
- **URL:** `/api/v1/users`
```json
{
  "name": "Pedro Inventario",
  "email": "pedro@demo.com",
  "password": "password123",
  "roleName": "INVENTORY_MANAGER"
}
```

### 2.2 Listar Usuarios
- **Método:** `GET`
- **URL:** `/api/v1/users`

### 2.3 Actualizar Usuario (Vendedor Juan pre-sembrado)
- **Método:** `PUT`
- **URL:** `/api/v1/users/bbbb0002-0000-0000-0000-000000000000`
```json
{
  "name": "Juan Ventas Modificado"
}
```

### 2.4 Eliminar Usuario
- **Método:** `DELETE`
- **URL:** `/api/v1/users/bbbb0002-0000-0000-0000-000000000000`

---

## 3. 🏷️ Categorías

### 3.1 Crear Categoría
- **Método:** `POST`
- **URL:** `/api/v1/categories`
```json
{
  "name": "Andamios",
  "description": "Estructuras metálicas",
  "slug": "andamios"
}
```

### 3.2 Listar Categorías
- **Método:** `GET`
- **URL:** `/api/v1/categories`

### 3.3 Actualizar Categoría (Construcción pre-sembrada)
- **Método:** `PUT`
- **URL:** `/api/v1/categories/cccc0001-0000-0000-0000-000000000000`
```json
{
  "description": "Maquinaria pesada actualizada"
}
```

### 3.4 Eliminar Categoría
- **Método:** `DELETE`
- **URL:** `/api/v1/categories/cccc0001-0000-0000-0000-000000000000`

---

## 4. 🏢 Bodegas / Ubicaciones

### 4.1 Crear Bodega
- **Método:** `POST`
- **URL:** `/api/v1/locations`
```json
{
  "name": "Bodega Este",
  "address": "Calle 50"
}
```

### 4.2 Listar Bodegas
- **Método:** `GET`
- **URL:** `/api/v1/locations`

### 4.3 Actualizar Bodega (Bodega Norte pre-sembrada)
- **Método:** `PUT`
- **URL:** `/api/v1/locations/dddd0001-0000-0000-0000-000000000000`
```json
{
  "address": "Calle 100 Modificada"
}
```

### 4.4 Eliminar Bodega
- **Método:** `DELETE`
- **URL:** `/api/v1/locations/dddd0001-0000-0000-0000-000000000000`

---

## 5. 📦 Catálogo de Productos

### 5.1 Crear Producto (En Categoría Construcción pre-sembrada)
- **Método:** `POST`
- **URL:** `/api/v1/products`
```json
{
  "name": "Planta Eléctrica",
  "categoryId": "cccc0001-0000-0000-0000-000000000000",
  "priceInCents": 1200000,
  "trackingType": "SERIALIZED"
}
```

### 5.2 Listar Productos
- **Método:** `GET`
- **URL:** `/api/v1/products`

### 5.3 Actualizar Producto (Taladro pre-sembrado)
- **Método:** `PUT`
- **URL:** `/api/v1/products/eeee0001-0000-0000-0000-000000000000`
```json
{
  "priceInCents": 55000
}
```

### 5.4 Eliminar Producto
- **Método:** `DELETE`
- **URL:** `/api/v1/products/eeee0001-0000-0000-0000-000000000000`

---

## 6. 🧑‍💼 Clientes

### 6.1 Crear Cliente
- **Método:** `POST`
- **URL:** `/api/v1/customers`
```json
{
  "name": "Empresa Nueva",
  "email": "nueva@empresa.com",
  "phone": "3200000000"
}
```

### 6.2 Listar Clientes
- **Método:** `GET`
- **URL:** `/api/v1/customers`

### 6.3 Actualizar Cliente (Constructora Beta pre-sembrada)
- **Método:** `PUT`
- **URL:** `/api/v1/customers/ffff0001-0000-0000-0000-000000000000`
```json
{
  "phone": "3009999999"
}
```

### 6.4 Eliminar Cliente
- **Método:** `DELETE`
- **URL:** `/api/v1/customers/ffff0001-0000-0000-0000-000000000000`

---

## 7. 🧰 Artículos Físicos (Inventario)

### 7.1 Ingresar Artículo Físico Nuevo (Taladro en Bodega Norte)
- **Método:** `POST`
- **URL:** `/api/v1/inventory-items`
```json
{
  "productId": "eeee0001-0000-0000-0000-000000000000",
  "locationId": "dddd0001-0000-0000-0000-000000000000",
  "serialNumber": "TAL-002",
  "quantity": 1
}
```

### 7.2 Listar Inventario
- **Método:** `GET`
- **URL:** `/api/v1/inventory-items`

### 7.3 Actualizar Artículo (Taladro 1 pre-sembrado)
- **Método:** `PUT`
- **URL:** `/api/v1/inventory-items/11110001-0000-0000-0000-000000000000`
```json
{
  "status": "MAINTENANCE"
}
```

### 7.4 Eliminar Artículo
- **Método:** `DELETE`
- **URL:** `/api/v1/inventory-items/11110001-0000-0000-0000-000000000000`

---

## 8. 📝 Movimientos de Inventario
*(Este módulo NO tiene PUT ni DELETE por motivos de auditoría).*

### 8.1 Registrar Movimiento (Ingreso de 10 Carpas pre-sembradas)
- **Método:** `POST`
- **URL:** `/api/v1/inventory-movements`
```json
{
  "itemId": "11110002-0000-0000-0000-000000000000",
  "quantity": 10,
  "type": "IN",
  "note": "Devolución masiva"
}
```

### 8.2 Listar Movimientos
- **Método:** `GET`
- **URL:** `/api/v1/inventory-movements`

---

## 9. 🚜 Alquileres

### 9.1 Crear Alquiler (Constructora Beta alquilando Taladro 1 pre-sembrado)
- **Método:** `POST`
- **URL:** `/api/v1/rentals`
```json
{
  "customerId": "ffff0001-0000-0000-0000-000000000000",
  "endDate": "2026-12-31T23:59:59Z",
  "totalInCents": 150000,
  "rentalItems": [
    { 
      "itemId": "11110001-0000-0000-0000-000000000000", 
      "quantity": 1, 
      "priceInCents": 150000 
    }
  ]
}
```

### 9.2 Listar Alquileres
- **Método:** `GET`
- **URL:** `/api/v1/rentals`

### 9.3 Actualizar Alquiler (Cambiar estado)
- **Método:** `PUT`
- **URL:** `/api/v1/rentals/22220001-0000-0000-0000-000000000000`
```json
{
  "status": "COMPLETED"
}
```

### 9.4 Eliminar Alquiler
- **Método:** `DELETE`
- **URL:** `/api/v1/rentals/22220001-0000-0000-0000-000000000000`

---

## 10. 🔧 Mantenimientos

### 10.1 Programar Mantenimiento (Para Taladro 1)
- **Método:** `POST`
- **URL:** `/api/v1/maintenances`
```json
{
  "itemId": "11110001-0000-0000-0000-000000000000",
  "description": "Engrase de rotor",
  "scheduledDate": "2026-05-15T08:00:00Z"
}
```

### 10.2 Listar Mantenimientos
- **Método:** `GET`
- **URL:** `/api/v1/maintenances`

### 10.3 Completar Mantenimiento
- **Método:** `PUT`
- **URL:** `/api/v1/maintenances/33330001-0000-0000-0000-000000000000`
```json
{
  "status": "COMPLETED",
  "completedDate": "2026-05-15T14:30:00Z"
}
```

### 10.4 Eliminar Mantenimiento
- **Método:** `DELETE`
- **URL:** `/api/v1/maintenances/33330001-0000-0000-0000-000000000000`
