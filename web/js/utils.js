/**
 * utils.js — Ingenio Arte & Madera
 * Funciones compartidas: toasts, validaciones, auth básico
 */

// ═══════════════════════════════
// TOASTS / NOTIFICACIONES
// ═══════════════════════════════
function mostrarToast(mensaje, tipo = 'success', duracion = 3000) {
  // Eliminar toast anterior si existe
  const anterior = document.querySelector('.toast');
  if (anterior) anterior.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.textContent = mensaje;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duracion);
}

// ═══════════════════════════════
// VALIDACIONES
// ═══════════════════════════════

/**
 * Muestra o limpia un error en un campo de formulario.
 * @param {HTMLElement} input - El input a validar
 * @param {string|null} mensajeError - null = limpia el error
 */
function mostrarError(input, mensajeError) {
  const errorEl = input.closest('.form-grupo, .campo-input')?.querySelector('.form-error, .campo-error');
  if (mensajeError) {
    input.classList.add('error');
    if (errorEl) {
      errorEl.textContent = mensajeError;
      errorEl.classList.add('visible');
    }
  } else {
    input.classList.remove('error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }
}

/**
 * Valida que un campo de texto no esté vacío.
 */
function validarRequerido(input, nombreCampo) {
  const valor = input.value.trim();
  if (!valor) {
    mostrarError(input, `${nombreCampo} es obligatorio.`);
    return false;
  }
  mostrarError(input, null);
  return true;
}

/**
 * Valida que un número no sea negativo y sea válido.
 * @param {HTMLInputElement} input
 * @param {string} nombreCampo
 * @param {boolean} soloEnteros
 */
function validarNumeroPositivo(input, nombreCampo, soloEnteros = false) {
  const valor = soloEnteros ? parseInt(input.value, 10) : parseFloat(input.value);

  if (input.value.trim() === '') {
    mostrarError(input, `${nombreCampo} es obligatorio.`);
    return false;
  }

  if (isNaN(valor)) {
    mostrarError(input, `${nombreCampo} debe ser un número válido.`);
    return false;
  }

  if (valor < 0) {
    mostrarError(input, `${nombreCampo} no puede ser negativo.`);
    return false;
  }

  if (soloEnteros && !Number.isInteger(Number(input.value))) {
    mostrarError(input, `${nombreCampo} debe ser un número entero.`);
    return false;
  }

  mostrarError(input, null);
  return true;
}

/**
 * Bloquea la escritura de números negativos en inputs tipo number.
 * Llamar al cargar la página con los selectores deseados.
 * @param {string} selector - CSS selector de los inputs
 */
function bloquearNegativos(selector) {
  document.querySelectorAll(selector).forEach(input => {
    input.setAttribute('min', '0');

    input.addEventListener('input', function () {
      const val = parseFloat(this.value);
      if (!isNaN(val) && val < 0) {
        this.value = 0;
        mostrarToast('No se permiten valores negativos.', 'warning');
      }
    });

    input.addEventListener('keydown', function (e) {
      // Bloquear el signo menos directamente
      if (e.key === '-' || e.key === 'Subtract') {
        e.preventDefault();
        mostrarToast('No se permiten valores negativos.', 'warning');
      }
    });
  });
}

// ═══════════════════════════════
// LÓGICA DE ESTADO (stock → estado)
// ═══════════════════════════════

/**
 * Determina el estado según el stock.
 * stock <= 0  → "Agotado"
 * stock >= 3  → "Disponible" (no se puede cambiar a Agotado manualmente)
 * stock 1-2   → puede estar en cualquier estado (zona gris)
 */
function calcularEstado(stock) {
  if (stock <= 0) return 'Agotado';
  if (stock >= 3) return 'Disponible';
  return null; // zona 1-2: no forzar
}

/**
 * Aplica las reglas de estado al select correspondiente.
 * @param {HTMLSelectElement} selectEstado
 * @param {number} stock
 */
function aplicarReglaEstado(selectEstado, stock) {
  const estadoCalculado = calcularEstado(stock);

  if (stock <= 0) {
    selectEstado.value = 'Agotado';
    selectEstado.disabled = true;
    selectEstado.title = 'Sin stock: el producto queda Agotado automáticamente.';
  } else if (stock >= 3) {
    selectEstado.value = 'Disponible';
    selectEstado.disabled = true;
    selectEstado.title = 'Con 3 o más unidades el estado es Disponible automáticamente.';
  } else {
    selectEstado.disabled = false;
    selectEstado.title = '';
  }
}

// ═══════════════════════════════
// AUTH BÁSICO (localStorage)
// ═══════════════════════════════

const AUTH_KEY = 'artemadera_session';

function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
}

function guardarSesion(usuario) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(usuario));
}

function cerrarSesion() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = '../login.html';
}

/**
 * Protege una página: redirige al login si no hay sesión activa.
 * @param {string} rolRequerido - 'admin' | 'cliente' | null (cualquier sesión)
 */
function requerirAuth(rolRequerido = null) {
  const sesion = obtenerSesion();
  if (!sesion) {
    window.location.href = '../login.html';
    return null;
  }
  if (rolRequerido && sesion.rol !== rolRequerido) {
    mostrarToast('No tienes permisos para esta página.', 'error');
    window.location.href = '../pages/shop.html';
    return null;
  }
  return sesion;
}

/**
 * Actualiza el botón de "Iniciar Sesión" en la nav si hay sesión.
 */
function actualizarNavAuth() {
  const sesion = obtenerSesion();
  const btnLogin = document.querySelector('#btn-login-nav');
  if (!btnLogin) return;

  if (sesion) {
    btnLogin.innerHTML = `<i class="bi bi-person-check-fill"></i> ${sesion.nombre}`;
    const btnLogout = document.querySelector('#btn-logout-nav');
    if (btnLogout) btnLogout.style.display = 'flex';
  }
}

// ═══════════════════════════════
// CARRITO (localStorage)
// ═══════════════════════════════

const CARRITO_KEY = 'artemadera_carrito';

function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];
  } catch {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  document.querySelectorAll('.numerito').forEach(el => {
    el.textContent = total;
  });
}

// Inicializar contador al cargar
document.addEventListener('DOMContentLoaded', () => {
  actualizarContadorCarrito();
  actualizarNavAuth();
});
