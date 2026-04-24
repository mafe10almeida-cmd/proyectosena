# 🪵 INGENIO ARTE & MADERA

> **Proyecto académico SENA** — Tienda de muebles artesanales con panel de administración, carrito de compras y API REST.

[![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)](https://www.mysql.com/)
[![HTML CSS JS](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-yellow?logo=html5)](/)
[![Maven](https://img.shields.io/badge/Build-Maven-red?logo=apachemaven)](https://maven.apache.org/)

---

## 📋 Tabla de contenidos

- [¿Qué es este proyecto?](#-qué-es-este-proyecto)
- [Programas necesarios](#-programas-necesarios)
- [Comandos de verificación](#-comandos-de-verificación)
- [Clonar el repositorio](#-clonar-el-repositorio)
- [Configurar la base de datos](#-configurar-la-base-de-datos)
- [Configurar credenciales](#-configurar-credenciales)
- [▶️ Correr el BACKEND](#️-correr-el-backend)
- [🌐 Correr el FRONTEND](#-correr-el-frontend)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Usuarios de prueba](#-usuarios-de-prueba)
- [Reglas de negocio](#-reglas-de-negocio)
- [Tests de QA](#-tests-de-qa)
- [Solución de problemas](#-solución-de-problemas)
- [Autores](#-autores)

---

## ¿Qué es este proyecto?

Sistema web para una tienda de muebles artesanales que incluye:

- 🛍️ **Catálogo de productos** visible para clientes
- 🛒 **Carrito de compras** con gestión de cantidades
- 🔧 **Panel administrador** con CRUD completo de productos
- 🔐 **Login con roles** (admin / cliente)
- 🔌 **API REST** construida con Spring Boot
- 🗄️ **Base de datos** MySQL gestionada con Spring Data JPA

---

## 💻 Programas necesarios

Antes de comenzar, descarga e instala los siguientes programas:

### 1. Java JDK 17
Motor que ejecuta el backend.

| | |
|---|---|
| 🔗 Descarga | https://adoptium.net |
| ✅ Versión requerida | Java 17 o superior |
| 💡 Durante la instalación | Marcar la opción **"Set JAVA_HOME"** |

### 2. IntelliJ IDEA Community Edition
IDE para abrir y ejecutar el proyecto backend.

| | |
|---|---|
| 🔗 Descarga | https://www.jetbrains.com/idea/download |
| ✅ Versión | Community (gratuita) |
| 💡 Nota | Incluye Maven integrado, no necesitas instalarlo por separado |

### 3. MySQL Server + MySQL Workbench
Base de datos del proyecto + herramienta visual para gestionarla.

| | |
|---|---|
| 🔗 Descarga | https://dev.mysql.com/downloads/installer |
| ✅ Versión requerida | MySQL 8.0 o superior |
| 💡 Durante la instalación | Seleccionar **"MySQL Server"** y **"MySQL Workbench"** |
| ⚠️ Contraseña root | Guardar bien la contraseña que elijan para `root` |

### 4. Git
Para clonar el repositorio.

| | |
|---|---|
| 🔗 Descarga | https://git-scm.com/downloads |
| ✅ Versión | Cualquier versión reciente |
| 💡 Nota | En Mac ya viene preinstalado |

### 5. Google Chrome / Firefox
Para visualizar el frontend.

> No se necesita ningún servidor web adicional. El frontend es HTML puro y se abre directamente en el navegador.

---

## 🖥️ Comandos de verificación

Abre una terminal (CMD en Windows / Terminal en Mac o Linux) y verifica que todo esté instalado correctamente:

```bash
# Verificar Java
java -version
```
✅ Debe mostrar algo como: `openjdk version "17.0.x"`

```bash
# Verificar Maven (desde IntelliJ o si lo instalaste por separado)
mvn -version
```
✅ Debe mostrar algo como: `Apache Maven 3.x.x`

```bash
# Verificar Git
git --version
```
✅ Debe mostrar algo como: `git version 2.x.x`

```bash
# Verificar MySQL
mysql --version
```
✅ Debe mostrar algo como: `mysql  Ver 8.x.x`

> ⚠️ Si algún comando muestra error, el programa no está instalado o no está en el PATH del sistema.

---

## 📥 Clonar el repositorio

Abre una terminal, navega a la carpeta donde quieres guardar el proyecto y ejecuta:

```bash
# 1. Clonar el repositorio
git clone https://github.com/mafe10almeida-cmd/proyectosena.git
```

```bash
# 2. Entrar a la carpeta del proyecto
cd proyectosena
```

```bash
# 3. Ver los archivos clonados (opcional, para verificar)
# En Windows:
dir

# En Mac / Linux:
ls -la
```

---

## 🗄️ Configurar la base de datos

### Opción A — Desde MySQL Workbench (recomendado para principiantes)

1. Abre **MySQL Workbench**
2. Haz clic en tu conexión local (normalmente `Local instance 3306`)
3. Ingresa tu contraseña de `root`
4. Copia y pega el siguiente script en el editor y presiona el rayo ⚡ para ejecutar:

```sql
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS ArteMadera
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE ArteMadera;

-- Crear la tabla de productos
CREATE TABLE IF NOT EXISTS producto (
  idProducto  INT           NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(120)  NOT NULL,
  descripcion VARCHAR(300),
  precio      DOUBLE        NOT NULL DEFAULT 0,
  stock       INT           NOT NULL DEFAULT 0,
  estado      VARCHAR(20)   NOT NULL DEFAULT 'Disponible',
  PRIMARY KEY (idProducto)
);

-- Insertar datos de prueba
INSERT INTO producto (nombre, descripcion, precio, stock, estado) VALUES
  ('Sillón Valencia',  'Sillón de cuero premium, color caoba',         800000,  5, 'Disponible'),
  ('Mesa Roble',       'Mesa de comedor en madera de roble 6 puestos', 1200000, 3, 'Disponible'),
  ('Silla Rústica',    'Silla artesanal en pino colombiano',            350000, 0, 'Agotado'),
  ('Cama King Nogal',  'Cama doble en madera de nogal con cabecero',   2500000, 4, 'Disponible'),
  ('Estantería Teca',  'Estantería flotante en teca barnizada',         650000, 2, 'Disponible');
```

### Opción B — Desde la terminal

```bash
# Conectarse a MySQL
mysql -u root -p

# Ingresar contraseña cuando la pida
# Luego pegar y ejecutar el script SQL de arriba
```

---

## ⚙️ Configurar credenciales

Abre el archivo `src/main/resources/application.properties` y cambia la contraseña por la que elegiste al instalar MySQL:

```properties
# ── Base de datos ──────────────────────────────────────
spring.datasource.url=jdbc:mysql://localhost:3306/ArteMadera
spring.datasource.username=root

# 👇 CAMBIA ESTO por tu contraseña de MySQL
spring.datasource.password=TU_CONTRASEÑA_AQUI

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ── JPA / Hibernate ────────────────────────────────────
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

> 💡 Si dejaste la contraseña en blanco al instalar MySQL, deja el campo `password=` vacío.

---

## ▶️ Correr el BACKEND

Tienes dos opciones. Elige la que prefieras:

---

### 🅰️ Opción 1 — Desde IntelliJ IDEA (más fácil)

```
Paso 1: Abrir el proyecto
        IntelliJ IDEA → File → Open → seleccionar la carpeta "proyectosena"

Paso 2: Esperar que carguen las dependencias
        Verás una barra de progreso abajo del IDE.
        Maven descargará automáticamente Spring Boot, JPA, MySQL connector, etc.
        Esto puede tardar unos minutos la primera vez.

Paso 3: Abrir la clase principal
        src → main → java → com → artemadera → ArtemaderaApplication.java

Paso 4: Ejecutar
        Clic en el botón ▶️ verde que aparece al lado del método main
        O presionar Shift + F10
```

**¿Cómo saber que el backend está corriendo?**

En la consola de IntelliJ verás algo así:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::               (v3.2.4)

Started ArtemaderaApplication in 3.245 seconds
Tomcat started on port(s): 8080 (http)
```

✅ Cuando veas **"Tomcat started on port(s): 8080"** el backend está listo.

---

### 🅱️ Opción 2 — Desde la terminal con Maven

```bash
# Desde la raíz del proyecto (donde está el pom.xml)

# Compilar y ejecutar directamente
mvn spring-boot:run
```

```bash
# O si prefieres compilar primero y luego ejecutar:

# Paso 1: Compilar (genera el archivo .jar)
mvn clean package -DskipTests

# Paso 2: Ejecutar el .jar generado
java -jar target/proyectofm-0.0.1-SNAPSHOT.jar
```

**Comandos útiles de Maven:**

```bash
# Descargar/actualizar todas las dependencias
mvn clean install

# Forzar re-descarga de dependencias (si algo falla)
mvn clean install -U

# Compilar sin correr tests
mvn clean package -DskipTests

# Ver las dependencias del proyecto
mvn dependency:tree
```

---

## 🌐 Correr el FRONTEND

> ⚠️ **El backend debe estar corriendo primero** antes de abrir el frontend.

### Pasos

```
Paso 1: Asegurarse de que el backend está en http://localhost:8080

Paso 2: Abrir la carpeta  web/  del proyecto en el explorador de archivos

Paso 3: Hacer doble clic en  login.html
        → Se abre automáticamente en tu navegador predeterminado

Paso 4: Iniciar sesión con:
        Usuario:    admin
        Contraseña: admin123
```

---

### 💡 Opción recomendada — Live Server (VS Code)

Si tienes **Visual Studio Code**, instala la extensión **Live Server** para una mejor experiencia:

```
1. Abrir VS Code
2. Ir a Extensiones (Ctrl + Shift + X)
3. Buscar "Live Server" de Ritwick Dey
4. Instalar
5. Abrir la carpeta web/ en VS Code
6. Clic derecho en login.html → "Open with Live Server"
```

Esto abre el frontend en `http://127.0.0.1:5500/login.html` y **recarga automáticamente** cada vez que guardes un archivo.

---

### Páginas del frontend

Una vez dentro, puedes navegar a:

| Página | Ruta | Descripción |
|--------|------|-------------|
| Login | `login.html` | Inicio de sesión y registro |
| Tienda | `pages/shop.html` | Catálogo de productos |
| Carrito | `pages/carrito.html` | Carrito de compras |
| Admin | `pages/admin.html` | CRUD de productos (solo admin) |
| Nosotros | `pages/nosotros.html` | Información del negocio |
| QA Tests | `qa/tests.html` | Tests automáticos |

---

## 📁 Estructura del proyecto

```
proyectosena/
│
├── 📂 src/
│   └── main/
│       ├── java/com/artemadera/
│       │   ├── ArtemaderaApplication.java   ← PUNTO DE ENTRADA (ejecutar esto)
│       │   ├── 📂 controllers/
│       │   │   └── ProductoController.java  ← API REST: GET, POST, DELETE
│       │   ├── 📂 dao/
│       │   │   └── ProductoDAO.java         ← Acceso JDBC (legacy)
│       │   ├── 📂 database/
│       │   │   └── Conexion.java            ← Conexión manual JDBC
│       │   ├── 📂 models/
│       │   │   └── Producto.java            ← Entidad JPA (tabla "producto")
│       │   └── 📂 repositories/
│       │       └── ProductoRepository.java  ← Spring Data JPA
│       └── resources/
│           └── application.properties       ← ⚙️ CONFIGURAR CONTRASEÑA AQUÍ
│
├── 📂 web/                                  ← FRONTEND (abrir login.html)
│   ├── login.html                           ← Página principal de entrada
│   ├── 📂 pages/
│   │   ├── shop.html
│   │   ├── admin.html
│   │   ├── carrito.html
│   │   └── nosotros.html
│   ├── 📂 css/
│   │   ├── main.css
│   │   ├── admin.css
│   │   ├── shop.css
│   │   ├── carrito.css
│   │   └── pages.css
│   ├── 📂 js/
│   │   ├── utils.js      ← Validaciones, toasts, auth, carrito
│   │   ├── admin.js      ← Lógica CRUD de productos
│   │   ├── login.js      ← Autenticación y sesión
│   │   ├── shop.js       ← Catálogo dinámico
│   │   └── carrito.js    ← Gestión del carrito
│   ├── 📂 IMG/           ← Imágenes de productos y logo
│   └── 📂 qa/
│       └── tests.html    ← Tests automáticos
│
├── pom.xml               ← Dependencias Maven (Spring Boot, JPA, MySQL)
└── README.md
```

---

## 🔌 Endpoints de la API

Base URL: `http://localhost:8080`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/productos` | Listar todos los productos |
| `POST` | `/api/productos/guardar` | Crear producto nuevo |
| `PUT` | `/api/productos/{id}` | Actualizar producto por ID |
| `DELETE` | `/api/productos/{id}` | Eliminar producto por ID |

### Probar la API desde el navegador

```
# Ver todos los productos (pegar en la barra del navegador):
http://localhost:8080/api/productos
```

### Probar la API con curl

```bash
# Listar todos los productos
curl http://localhost:8080/api/productos

# Crear un producto nuevo
curl -X POST http://localhost:8080/api/productos/guardar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mesa Centro",
    "descripcion": "Mesa de centro artesanal",
    "precio": 450000,
    "stock": 3,
    "estado": "Disponible"
  }'

# Eliminar producto con ID 1
curl -X DELETE http://localhost:8080/api/productos/1
```

### Ejemplo de respuesta JSON

```json
[
  {
    "idProducto": 1,
    "nombre": "Sillón Valencia",
    "descripcion": "Sillón de cuero premium, color caoba",
    "precio": 800000.0,
    "stock": 5,
    "estado": "Disponible"
  },
  {
    "idProducto": 2,
    "nombre": "Mesa Roble",
    "descripcion": "Mesa de comedor en madera de roble 6 puestos",
    "precio": 1200000.0,
    "stock": 3,
    "estado": "Disponible"
  }
]
```

---

## 🔐 Usuarios de prueba

| Usuario | Contraseña | Rol | ¿A dónde va? |
|---------|-----------|-----|--------------|
| `admin` | `admin123` | Administrador | Panel CRUD |
| `cliente` | `cliente123` | Cliente | Tienda y carrito |
| `sebas` | `sebas2025` | Administrador | Panel CRUD |
| `mafe` | `mafe2025` | Administrador | Panel CRUD |

---

## ✅ Reglas de negocio

### No se permiten valores negativos
Los campos de precio y stock rechazan números negativos tanto en el formulario como en el envío.

### Estado automático según stock

| Stock | Estado que se asigna | ¿Se puede cambiar manualmente? |
|-------|---------------------|-------------------------------|
| `0` o menos | 🔴 Agotado | ❌ No — automático |
| `1` o `2` | libre | ✅ Sí |
| `3` o más | 🟢 Disponible | ❌ No — automático |

---

## 🧪 Tests de QA

1. Con el backend corriendo, abrir `web/qa/tests.html` en el navegador
2. Los 33 tests se ejecutan automáticamente

**Suites de prueba:**

| Suite | Tests | Qué prueba |
|-------|-------|-----------|
| 1 | 13 | Validaciones numéricas (negativos, vacíos, texto inválido) |
| 2 | 6 | Reglas de estado/stock automático |
| 3 | 5 | Carrito (persistencia, vaciado, JSON corrupto) |
| 4 | 3 | Autenticación y sesión |
| 5 | 4 | Sanitización XSS |
| 6 | 3 | API REST (requiere backend activo) |

---

## ❗ Solución de problemas

### ❌ `Communications link failure` — MySQL no conecta

```bash
# Windows — iniciar MySQL desde Servicios o:
net start mysql

# Mac
brew services start mysql

# Linux
sudo systemctl start mysql
sudo systemctl status mysql   # verificar que está activo
```

---

### ❌ `Access denied for user 'root'` — Contraseña incorrecta

Verifica que la contraseña en `application.properties` coincida con la que usas para entrar a MySQL Workbench.

```bash
# Probar la conexión directamente en terminal
mysql -u root -p
# Si pide contraseña y puedes entrar → la contraseña es correcta
# Si dice "Access denied" → necesitas recordar/resetear la contraseña
```

---

### ❌ Los productos no cargan en la tienda

Significa que el backend no está corriendo. Verifica:

1. IntelliJ muestra **"Tomcat started on port 8080"** en consola
2. Abre en el navegador: `http://localhost:8080/api/productos`
   - Si ves JSON → ✅ backend OK
   - Si la página no carga → ❌ backend no está corriendo

---

### ❌ Puerto 8080 ocupado

```
Web server failed to start. Port 8080 was already in use.
```

Cambiar el puerto en `application.properties`:

```properties
server.port=8081
```

Y actualizar en todos los archivos JS de `web/js/` la línea:

```javascript
// Cambiar esto:
const API_URL = 'http://localhost:8080/api/productos';

// Por esto:
const API_URL = 'http://localhost:8081/api/productos';
```

---

### ❌ Maven no descarga dependencias

```bash
# Limpiar caché y volver a descargar todo
mvn clean install -U

# Si persiste el error, borrar la caché local de Maven:
# Windows:   eliminar la carpeta  C:\Users\TU_USUARIO\.m2\repository
# Mac/Linux: rm -rf ~/.m2/repository
# Y volver a ejecutar: mvn clean install
```

---

### ❌ IntelliJ no reconoce las clases de Spring

```
File → Invalidate Caches → Invalidate and Restart
```

---

## 👩‍💻 Autores

| Nombre | GitHub |
|--------|--------|
| **Mafe Almeida** | [@mafe10almeida-cmd](https://github.com/mafe10almeida-cmd) |
| **Sebastián** | *(agregar usuario de GitHub)* |

Proyecto desarrollado como práctica de formación en el **SENA** — 2025.

---

## 📄 Licencia

Este proyecto es de uso académico y educativo.

---

*¿Encontraste un bug o tienes una sugerencia? Abre un [Issue](https://github.com/mafe10almeida-cmd/proyectosena/issues)*
