/**
 * login.js — Autenticación básica del frontend
 *
 * En producción, esto se reemplazaría por una llamada real al backend
 * (Spring Security + JWT). Por ahora simula usuarios locales.
 */

// Usuarios demo (en producción → validar contra API)
const USUARIOS_DEMO = [
  { usuario: 'admin',    clave: 'admin123',  nombre: 'Administrador', rol: 'admin' },
  { usuario: 'cliente',  clave: 'cliente123', nombre: 'Cliente Demo',  rol: 'cliente' },
  { usuario: 'sebas',    clave: 'sebas2025',  nombre: 'Sebastián',     rol: 'admin' },
  { usuario: 'mafe',     clave: 'mafe2025',   nombre: 'Mafe',          rol: 'admin' },
];

document.addEventListener('DOMContentLoaded', () => {
  // Si ya hay sesión activa, redirigir
  const sesion = obtenerSesion();
  if (sesion) {
    redirigirPorRol(sesion.rol);
    return;
  }

  configurarTabs();
  configurarFormularios();
});

// ── Tabs Login / Registro ─────────────────────────────────
function configurarTabs() {
  document.querySelectorAll('.login-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.login-form').forEach(f => f.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target)?.classList.add('active');
    });
  });
}

// ── Formularios ───────────────────────────────────────────
function configurarFormularios() {
  document.getElementById('form-login')?.addEventListener('submit', onLogin);
  document.getElementById('form-registro')?.addEventListener('submit', onRegistro);
}

// ── Login ─────────────────────────────────────────────────
async function onLogin(e) {
  e.preventDefault();

  const usuarioInput = document.getElementById('login-usuario');
  const claveInput   = document.getElementById('login-clave');
  const mensaje      = document.getElementById('login-mensaje');

  let valido = true;
  if (!validarRequerido(usuarioInput, 'El usuario')) valido = false;
  if (!validarRequerido(claveInput,   'La contraseña')) valido = false;
  if (!valido) return;

  const usuario = usuarioInput.value.trim().toLowerCase();
  const clave   = claveInput.value;

  // Simulación de "carga"
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Verificando...';
  btn.disabled    = true;

  await delay(600); // Simula llamada a API

  // TODO: Reemplazar por llamada real: await fetch('/api/auth/login', {...})
  const encontrado = USUARIOS_DEMO.find(
    u => u.usuario === usuario && u.clave === clave
  );

  btn.textContent = 'Iniciar Sesión';
  btn.disabled    = false;

  if (!encontrado) {
    mensaje.textContent = 'Usuario o contraseña incorrectos.';
    mensaje.className   = 'login-mensaje error';
    claveInput.value    = '';
    claveInput.focus();
    return;
  }

  // Guardar sesión
  guardarSesion({
    usuario:  encontrado.usuario,
    nombre:   encontrado.nombre,
    rol:      encontrado.rol,
    ingreso:  new Date().toISOString(),
  });

  mensaje.textContent = `¡Bienvenido, ${encontrado.nombre}! Redirigiendo...`;
  mensaje.className   = 'login-mensaje success';

  await delay(800);
  redirigirPorRol(encontrado.rol);
}

// ── Registro ──────────────────────────────────────────────
async function onRegistro(e) {
  e.preventDefault();

  const nombreInput    = document.getElementById('reg-nombre');
  const usuarioInput   = document.getElementById('reg-usuario');
  const claveInput     = document.getElementById('reg-clave');
  const confirmaInput  = document.getElementById('reg-confirma');
  const mensaje        = document.getElementById('reg-mensaje');

  let valido = true;
  if (!validarRequerido(nombreInput,   'El nombre')) valido = false;
  if (!validarRequerido(usuarioInput,  'El usuario')) valido = false;
  if (!validarRequerido(claveInput,    'La contraseña')) valido = false;
  if (!validarRequerido(confirmaInput, 'La confirmación')) valido = false;

  if (claveInput.value.length < 6) {
    mostrarError(claveInput, 'La contraseña debe tener al menos 6 caracteres.');
    valido = false;
  }

  if (claveInput.value !== confirmaInput.value) {
    mostrarError(confirmaInput, 'Las contraseñas no coinciden.');
    valido = false;
  }

  if (!valido) return;

  // TODO: Reemplazar por llamada real al backend
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Registrando...';
  btn.disabled    = true;

  await delay(700);

  btn.textContent = 'Crear Cuenta';
  btn.disabled    = false;

  mensaje.textContent = 'Cuenta creada. Ahora puedes iniciar sesión.';
  mensaje.className   = 'login-mensaje success';
  e.target.reset();

  // Cambiar al tab de login
  setTimeout(() => {
    document.querySelector('[data-target="form-login"]')?.click();
  }, 1500);
}

// ── Helpers ───────────────────────────────────────────────
function redirigirPorRol(rol) {
  if (rol === 'admin') {
    window.location.href = 'pages/admin.html';
  } else {
    window.location.href = 'pages/shop.html';
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
