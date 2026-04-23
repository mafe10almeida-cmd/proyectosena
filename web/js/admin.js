/**
 * admin.js — CRUD Productos
 * Reglas:
 *   - No se permiten números negativos
 *   - Stock <= 0  → estado = "Agotado" (automático, no editable)
 *   - Stock >= 3  → estado = "Disponible" (automático, no editable)
 *   - Stock 1-2   → estado editable manualmente
 */

const API_URL = 'http://localhost:8080/api/productos';

// ── Estado local ──────────────────────────────────────────
let productos = [];
let modoEdicion = false;
let idEditando = null;

// ── Referencias DOM ───────────────────────────────────────
const modal        = document.getElementById('modal-producto');
const modalTitulo  = document.getElementById('modal-titulo');
const form         = document.getElementById('form-producto');
const tablaBody    = document.getElementById('tabla-body');
const inputBuscar  = document.getElementById('buscar');
const filtroEstado = document.getElementById('filtro-estado');

const inpNombre      = document.getElementById('inp-nombre');
const inpDescripcion = document.getElementById('inp-descripcion');
const inpPrecio      = document.getElementById('inp-precio');
const inpStock       = document.getElementById('inp-stock');
const selEstado      = document.getElementById('sel-estado');

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  bloquearNegativos('#inp-precio, #inp-stock');
  cargarProductos();
  configurarEventos();
});

// ── API ───────────────────────────────────────────────────
async function cargarProductos() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al conectar con el servidor.');
    productos = await res.json();
    renderizarTabla(productos);
  } catch (err) {
    mostrarToast('No se pudo cargar los productos. ¿El servidor está activo?', 'error');
    console.error(err);
    // Datos de prueba para desarrollo sin backend
    productos = datosEjemplo();
    renderizarTabla(productos);
  }
}

async function guardarProducto(datos) {
  const url    = modoEdicion ? `${API_URL}/${idEditando}` : `${API_URL}/guardar`;
  const metodo = modoEdicion ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!res.ok) {
    const texto = await res.text();
    throw new Error(texto || 'Error al guardar el producto.');
  }
  return res.json();
}

async function eliminarProducto(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar el producto.');
}

// ── Render ────────────────────────────────────────────────
function renderizarTabla(lista) {
  if (!tablaBody) return;

  if (lista.length === 0) {
    tablaBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;color:#aaa;padding:30px;">
          No hay productos registrados.
        </td>
      </tr>`;
    return;
  }

  tablaBody.innerHTML = lista.map(p => `
    <tr data-id="${p.idProducto}">
      <td>${p.idProducto}</td>
      <td><strong>${escapeHtml(p.nombre)}</strong></td>
      <td>${escapeHtml(p.descripcion || '—')}</td>
      <td>$${formatearPrecio(p.precio)}</td>
      <td>${p.stock}</td>
      <td><span class="badge-${p.estado === 'Disponible' ? 'disponible' : 'agotado'}">${p.estado}</span></td>
      <td>
        <div class="acciones-td">
          <button class="btn-secundario" onclick="abrirEdicion(${p.idProducto})">
            <i class="bi bi-pencil-fill"></i> Editar
          </button>
          <button class="btn-danger" onclick="confirmarEliminar(${p.idProducto})">
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── Filtros ───────────────────────────────────────────────
function aplicarFiltros() {
  const texto  = inputBuscar?.value.toLowerCase() || '';
  const estado = filtroEstado?.value || '';

  const filtrados = productos.filter(p => {
    const coincideTexto = p.nombre.toLowerCase().includes(texto) ||
                          (p.descripcion || '').toLowerCase().includes(texto);
    const coincideEstado = !estado || p.estado === estado;
    return coincideTexto && coincideEstado;
  });

  renderizarTabla(filtrados);
}

// ── Modal ─────────────────────────────────────────────────
function abrirCrear() {
  modoEdicion = false;
  idEditando  = null;
  form.reset();
  limpiarErrores();
  selEstado.disabled = false;
  modalTitulo.textContent = 'Nuevo Producto';
  abrirModal();
}

function abrirEdicion(id) {
  const p = productos.find(x => x.idProducto === id);
  if (!p) return;

  modoEdicion = true;
  idEditando  = id;

  inpNombre.value      = p.nombre;
  inpDescripcion.value = p.descripcion || '';
  inpPrecio.value      = p.precio;
  inpStock.value       = p.stock;
  selEstado.value      = p.estado;

  aplicarReglaEstado(selEstado, p.stock);
  limpiarErrores();
  modalTitulo.textContent = `Editar Producto #${id}`;
  abrirModal();
}

function abrirModal() {
  modal.classList.add('open');
  inpNombre.focus();
}

function cerrarModal() {
  modal.classList.remove('open');
  form.reset();
  limpiarErrores();
}

// ── Validación del formulario ─────────────────────────────
function validarFormulario() {
  let valido = true;

  if (!validarRequerido(inpNombre, 'El nombre')) valido = false;
  if (!validarNumeroPositivo(inpPrecio, 'El precio', false)) valido = false;
  if (!validarNumeroPositivo(inpStock, 'El stock', true)) valido = false;

  return valido;
}

function limpiarErrores() {
  [inpNombre, inpDescripcion, inpPrecio, inpStock].forEach(el => {
    if (el) mostrarError(el, null);
  });
}

// ── Submit ────────────────────────────────────────────────
async function onSubmit(e) {
  e.preventDefault();

  if (!validarFormulario()) {
    mostrarToast('Corrige los errores antes de guardar.', 'error');
    return;
  }

  const stock  = parseInt(inpStock.value, 10);
  const estado = calcularEstadoFinal(stock, selEstado.value);

  const datos = {
    nombre:      inpNombre.value.trim(),
    descripcion: inpDescripcion.value.trim(),
    precio:      parseFloat(inpPrecio.value),
    stock,
    estado,
  };

  if (modoEdicion) datos.idProducto = idEditando;

  try {
    const guardado = await guardarProducto(datos);

    if (modoEdicion) {
      const idx = productos.findIndex(x => x.idProducto === idEditando);
      if (idx !== -1) productos[idx] = guardado;
    } else {
      productos.push(guardado);
    }

    renderizarTabla(productos);
    cerrarModal();
    mostrarToast(modoEdicion ? 'Producto actualizado ✔' : 'Producto creado ✔', 'success');
  } catch (err) {
    mostrarToast(`Error: ${err.message}`, 'error');
    console.error(err);
  }
}

// Calcula estado final respetando las reglas de negocio
function calcularEstadoFinal(stock, estadoActual) {
  if (stock <= 0) return 'Agotado';
  if (stock >= 3) return 'Disponible';
  // Stock 1-2: usar lo que el usuario eligió
  return estadoActual;
}

// ── Eliminar ──────────────────────────────────────────────
function confirmarEliminar(id) {
  const p = productos.find(x => x.idProducto === id);
  if (!p) return;

  if (!confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;

  eliminarProductoLocal(id);
}

async function eliminarProductoLocal(id) {
  try {
    await eliminarProducto(id);
    productos = productos.filter(x => x.idProducto !== id);
    renderizarTabla(productos);
    mostrarToast('Producto eliminado.', 'success');
  } catch (err) {
    mostrarToast(`Error al eliminar: ${err.message}`, 'error');
  }
}

// ── Eventos stock → estado automático ─────────────────────
function onStockChange() {
  const stock = parseInt(inpStock.value, 10);
  if (!isNaN(stock)) aplicarReglaEstado(selEstado, stock);
}

// ── Configurar eventos ────────────────────────────────────
function configurarEventos() {
  form?.addEventListener('submit', onSubmit);
  inpStock?.addEventListener('input', onStockChange);
  inputBuscar?.addEventListener('input', aplicarFiltros);
  filtroEstado?.addEventListener('change', aplicarFiltros);

  // Cerrar modal al hacer click fuera
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
  });

  // ESC para cerrar modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModal();
  });
}

// ── Helpers ───────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatearPrecio(numero) {
  return Number(numero).toLocaleString('es-CO');
}

// Datos de prueba para usar sin backend
function datosEjemplo() {
  return [
    { idProducto: 1, nombre: 'Sillón Valencia', descripcion: 'Sillón de cuero premium', precio: 800000, stock: 5, estado: 'Disponible' },
    { idProducto: 2, nombre: 'Mesa Roble', descripcion: 'Mesa de comedor en roble', precio: 1200000, stock: 2, estado: 'Disponible' },
    { idProducto: 3, nombre: 'Silla Rústica', descripcion: 'Silla en madera de pino', precio: 350000, stock: 0, estado: 'Agotado' },
  ];
}
