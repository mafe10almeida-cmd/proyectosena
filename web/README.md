# 🪵 INGENIO ARTE & MADERA — Frontend

Proyecto académico de tienda de muebles artesanales.
**Stack:** HTML5 · CSS3 · Vanilla JS · Spring Boot (backend) · MySQL

---

## 📁 Estructura del proyecto

```
artemadera/                     ← FRONTEND (esta carpeta)
│
├── login.html                  ← Página de inicio de sesión y registro
│
├── css/
│   ├── main.css                ← Estilos globales (variables, nav, toasts)
│   ├── shop.css                ← Catálogo de la tienda
│   ├── carrito.css             ← Página del carrito
│   ├── admin.css               ← Panel CRUD administrador
│   └── pages.css               ← Login + Nosotros
│
├── js/
│   ├── utils.js                ← Funciones compartidas (validaciones, auth, carrito)
│   ├── login.js                ← Lógica de autenticación
│   ├── admin.js                ← CRUD de productos
│   ├── shop.js                 ← Catálogo dinámico
│   └── carrito.js              ← Gestión del carrito
│
├── pages/
│   ├── shop.html               ← Tienda / Catálogo
│   ├── admin.html              ← Panel administrador (CRUD)
│   ├── carrito.html            ← Carrito de compras
│   └── nosotros.html           ← Página corporativa
│
├── qa/
│   └── tests.html              ← Panel de QA con tests automáticos
│
└── IMG/                        ← Imágenes (sin cambios)
```

---

## 🚀 Cómo ejecutar

### Frontend (sin backend)
Abrir `login.html` directamente en el navegador.
Los datos de productos usarán datos demo automáticamente.

### Con backend
1. Asegúrate de que Spring Boot esté corriendo en `http://localhost:8080`
2. Abre `login.html` en el navegador
3. La API se conecta en `http://localhost:8080/api/productos`

---

## 🔐 Usuarios de prueba (demo)

| Usuario   | Contraseña    | Rol      | Acceso                     |
|-----------|---------------|----------|----------------------------|
| admin     | admin123      | admin    | Panel administrador        |
| cliente   | cliente123    | cliente  | Tienda                     |
| sebas     | sebas2025     | admin    | Panel administrador        |
| mafe      | mafe2025      | admin    | Panel administrador        |

> En producción, reemplazar por autenticación real con Spring Security + JWT.

---

## ✅ Reglas de negocio implementadas

### Validaciones en formularios
- **No se permiten negativos** en precio ni stock (bloqueado en input + validado en submit)
- **Campos obligatorios** validados con mensajes de error inline
- **Solo enteros** en stock (no se aceptan decimales)

### Lógica de estado
| Stock        | Estado         | Select editable |
|--------------|----------------|-----------------|
| `<= 0`       | Agotado        | ❌ No           |
| `1` o `2`    | (libre)        | ✅ Sí           |
| `>= 3`       | Disponible     | ❌ No           |

---

## 🧪 QA

Abrir `qa/tests.html` en el navegador para ejecutar los tests automáticos.

**Suites incluidas:**
- Suite 1: Validaciones numéricas (negativos, vacíos, texto inválido)
- Suite 2: Reglas de estado/stock
- Suite 3: Carrito (persistencia, vaciado, JSON corrupto)
- Suite 4: Autenticación (sesión, JSON corrupto)
- Suite 5: Sanitización / XSS (escapeHtml)
- Suite 6: API REST (requiere backend activo)

---

## ⚛️ Roadmap → React

Cuando llegue el momento de migrar:

| Ahora (HTML/JS)              | En React                            |
|------------------------------|-------------------------------------|
| `pages/shop.html`            | `src/pages/ShopPage.jsx`            |
| `pages/admin.html`           | `src/pages/AdminPage.jsx`           |
| `pages/carrito.html`         | `src/pages/CartPage.jsx`            |
| `login.html`                 | `src/pages/LoginPage.jsx`           |
| Nav repetida en cada página  | `src/components/Navbar.jsx`         |
| Tarjeta de producto          | `src/components/ProductCard.jsx`    |
| Modal CRUD                   | `src/components/ProductModal.jsx`   |
| `js/utils.js` (carrito)      | `src/hooks/useCarrito.js`           |
| `js/utils.js` (auth)         | `src/hooks/useAuth.js`              |
| `fetch(API_URL)` en cada JS  | `src/services/productosService.js`  |
| `localStorage` directo       | Context API o Zustand               |
| Routing entre HTML           | React Router v6                     |

**El backend Spring Boot no cambia nada** — React consume la misma API REST.

---

## 🔧 Variables de entorno (futuro)

```
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENV=development
```

---

*by Sebas y Mafe © 2025*
