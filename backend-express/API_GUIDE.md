# 🚀 AlquilaSoft API - Guía de Referencia (v2)

Esta guía explica en detalle cómo interactuar con todos los endpoints del backend, cómo integrarlo en tu frontend y el flujo ideal para hacer pruebas paso a paso.

---

## 🛡️ Seguridad y Autenticación

Todos los endpoints protegidos requieren el siguiente header:
```
Authorization: Bearer <JWT_TOKEN>
```
El token se obtiene al hacer **Onboarding** o **Login**. Contiene de forma segura el `tenantId` (empresa), `userId` y `role`. No requieres pasar manualmente de qué empresa eres, esto se hace de forma automática.

> **Importante:** La API cuenta con medidas estrictas de prevención. Las consultas generales están limitadas a **100 peticiones / 15m**, y los endpoints de Login a máximo **20 intentos / 15m** por IP. Además, usamos `helmet` para proteger las cabeceras HTTP.

---

## 👥 Roles del Sistema

| Rol | Descripción |
| :--- | :--- |
| `TENANT_ADMIN` | Control total dentro de su organización. Gestiona usuarios, roles, catálogo y configuración general. |
| `SALES_AGENT` | Interactúa con el cliente final. Crea alquileres, registra devoluciones, administra clientes. Sin operaciones destructivas. |
| `INVENTORY_MANAGER` | Control logístico. Gestiona ingreso/salida de artículos, bodegas e historial de mantenimientos/movimientos. |

---

## 📂 Endpoints

### 1. Autenticación (Públicos)

#### `POST /api/v1/auth/onboarding`
Crea un nuevo negocio (Tenant) junto con su primer Administrador.
```json
// Body
{
  "tenantName": "Alquileres Express S.A.",
  "name": "Juan Pérez",
  "email": "juan@empresa.com",
  "password": "clave_segura"
}
```

#### `POST /api/v1/auth/login`
Inicia sesión con email y contraseña.
```json
// Body
{
  "email": "juan@empresa.com",
  "password": "clave_segura"
}
```

---

### 2. Usuarios — Solo `TENANT_ADMIN`

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/v1/users` | Lista todos los usuarios de la empresa |
| `POST` | `/api/v1/users` | Crea un nuevo empleado |
| `GET` | `/api/v1/users/:id` | Consulta un usuario por ID |
| `PUT` | `/api/v1/users/:id` | Actualiza datos de un usuario |
| `DELETE` | `/api/v1/users/:id` | Elimina un usuario |

```json
// POST /api/v1/users — Body
{
  "name": "Ana Gómez",
  "email": "ana@empresa.com",
  "password": "clave123",
  "roleName": "SALES_AGENT"
}
```

---

### 3. Categorías de Producto

| Método | Endpoint | TENANT_ADMIN | SALES_AGENT | INVENTORY_MANAGER |
| :--- | :--- | :---: | :---: | :---: |
| `GET` | `/api/v1/categories` | ✅ | ✅ | ✅ |
| `POST` | `/api/v1/categories` | ✅ | ✗ | ✗ |
| `PUT` | `/api/v1/categories/:id` | ✅ | ✗ | ✗ |
| `DELETE` | `/api/v1/categories/:id` | ✅ | ✗ | ✗ |

```json
// POST /api/v1/categories — Body
{ "name": "Construcción", "description": "Equipos para obra", "slug": "construccion" }
```

---

### 4. Ubicaciones / Bodegas

| Método | Endpoint | Acceso Requerido |
| :--- | :--- | :--- |
| `GET / POST / PUT` | `/api/v1/locations` | `TENANT_ADMIN`, `INVENTORY_MANAGER` |

```json
// POST /api/v1/locations — Body
{ "name": "Bodega Norte", "address": "Cra 5 #10-20" }
```

---

### 5. Productos (Catálogo Base)

| Método | Endpoint | Acceso Requerido |
| :--- | :--- | :--- |
| `GET` | `/api/v1/products` | Todos |
| `POST / PUT / DELETE`| `/api/v1/products` | Solo `TENANT_ADMIN` |

```json
// POST /api/v1/products — Body
{
  "name": "Taladro Industrial v2",
  "categoryId": "<uuid-categoria>",
  "priceInCents": 5000,
  "trackingType": "SERIALIZED"
}
```

---

### 6. Artículos de Inventario Físico (`InventoryItems`)

*Nota: Aquí defines las unidades físicas reales que posees en base a un Producto genérico del Catálogo.*

| Método | Endpoint | Acceso Requerido |
| :--- | :--- | :--- |
| `GET` | `/api/v1/inventory-items` | Todos |
| `POST / PUT`| `/api/v1/inventory-items` | `INVENTORY_MANAGER` |

```json
// POST /api/v1/inventory-items — Body
{
  "productId": "<uuid-producto>",
  "locationId": "<uuid-bodega>",
  "serialNumber": "SN-001",
  "quantity": 1
}
```

---

### 7. Clientes

| Método | Endpoint | Acceso Requerido |
| :--- | :--- | :--- |
| `GET` | `/api/v1/customers` | `TENANT_ADMIN`, `SALES_AGENT` |
| `POST / PUT` | `/api/v1/customers` | `SALES_AGENT` |

```json
// POST /api/v1/customers — Body
{ "name": "Carlos Ruiz", "email": "carlos@gmail.com", "phone": "3001234567" }
```

---

### 8. Alquileres (`Rentals`)

> **[Lógica Inteligente]** Al crear un alquiler, se crea un entorno de transacción. El estado de todos los artículos cambia matemáticamente a `RENTED`. Si envías a alquilar un artículo que no esté en estado `AVAILABLE` (por ejemplo, porque ya está rentado o en mantenimiento), la API rechazará toda la operación. El backend **calcula automáticamente el precio total** en base al costo de cada unidad del catálogo, por lo que no es necesario enviarlo de forma insegura desde el frontend.

| Método | Endpoint | Acceso Requerido |
| :--- | :--- | :--- |
| `GET / POST / PUT` | `/api/v1/rentals` | `SALES_AGENT` |

```json
// POST /api/v1/rentals — Body
{
  "customerId": "<uuid-cliente>",
  "endDate": "2026-12-31T23:59:59Z",
  "items": [
    { "itemId": "<uuid-inventory-item>", "quantity": 1 }
  ]
}
```

Para actualizar su estado (ej. devoluciones completas o parciales):
```json
// PUT /api/v1/rentals/:id — Body
{
  "status": "RETURNED" 
}
// Estados válidos: ACTIVE, PARTIAL_RETURN, RETURNED, CANCELLED
```

---

### 9. Mantenimientos (`Maintenances`)

> **[Lógica Inteligente]** Enviar un ítem físico a mantenimiento bloquea dicho producto y lo cambia a estado `MAINTENANCE`. Una vez que se pasa un requerimiento de tipo `PUT` actualizando el estado a `COMPLETED`, el ítem regresa al estado `AVAILABLE`.

| Método | Endpoint | Acceso Requerido |
| :--- | :--- | :--- |
| `GET / POST / PUT` | `/api/v1/maintenances` | `TENANT_ADMIN`, `INVENTORY_MANAGER` |

```json
// POST /api/v1/maintenances — Body
{
  "itemId": "<uuid-item>",
  "description": "Revisión anual de motor",
  "scheduledDate": "2026-05-01T08:00:00Z"
}
```

```json
// PUT /api/v1/maintenances/:id — Body
{
  "status": "COMPLETED"
}
```

---

### 10. Movimientos de Inventario (Auditoría)

| Método | Endpoint | Acceso Requerido |
| :--- | :--- | :--- |
| `GET / POST` | `/api/v1/inventory-movements` | `INVENTORY_MANAGER` |

```json
// POST /api/v1/inventory-movements — Body
{
  "itemId": "<uuid-item>",
  "quantity": 5,
  "type": "IN",
  "note": "Ingreso por compra de proveedor"
}
```

---

## 🧪 Flujo y Orden de Pruebas Total

Para probar tu API desde Postman/Thunder Client de forma progresiva, hazlo en el siguiente orden lógico:

1. **`POST /api/v1/auth/onboarding`**    → Crear la empresa y tu Administrador Maestro.
2. **`POST /api/v1/auth/login`**         → (Opcional) Usa este endpoint para recuperar un token fresco en caso del inicio clásico. Copia el `"token"`.
3. **`POST /api/v1/categories`**         → Crea una categoría genérica.
4. **`POST /api/v1/locations`**          → Crea un depósito físico.
5. **`POST /api/v1/products`**           → Añade el ítem abstracto a tu Catálogo con el `categoryId` anterior.
6. **`POST /api/v1/inventory-items`**    → Haz nacer unidades **físicas** atándolas al Catálogo y a la Bodega.
   _*(Nota visual: el ítem nacerá como `AVAILABLE`)*_
7. **`POST /api/v1/customers`**          → Crea tu primer cliente.
8. **`POST /api/v1/rentals`**            → Alquila la unidad física al cliente anterior.  
   _*(Podrás comprobar haciendo GET en `inventory-items/` que el objeto ahora es `RENTED` y no permite re-alquilarse)*._

---

## ⚠️ Errores Típicos & Zod

Dado que la API posee verificaciones paramétricas **estrictas con Zod**, si un Frontend envía un JSON inválido (como un texto en lugar de un número, strings muy cortos o UUIDs falsos), obtendrás este patrón de error con estatus `400`:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": "body.items.0.quantity",
      "message": "Quantity must be positive"
    }
  ]
}
```

| HTTP | Descripción General |
| :--- | :--- |
| `400` | Campos Zod inválidos. Revisa `details` con exactitud. Múltiples lógicas fallidas (Ej. Mantenimiento para objeto alquilado). |
| `401` | Token inyectado como Header es inexistente, caduco, corrupto o datos erróneos durante el Login. |
| `403` | Estás intentando una acción de la cual no posees el Rol (ej. un `SALES_AGENT` eliminando algo). |
| `404` | Tratando de editar, leer o asociar un `id` que no existe en tu empresa. |
| `409` | Conflicto — registro duplicado (ej. email global ya registrado). |
| `429` | Se ha bloqueado tu IP para proteger contra bots al superar el `Rate Limit`. |
| `500` | Error interno. |
