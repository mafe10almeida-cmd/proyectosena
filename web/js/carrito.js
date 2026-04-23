/**
 * carrito.js — Gestión del carrito de compras
 */

document.addEventListener('DOMContentLoaded', () => {
  renderizarCarrito();
  document.getElementById('btn-vaciar')?.addEventListener('click', vaciarCarrito);
  document.getElementById('btn-comprar')?.addEventListener('click', procesarCompra);
});

function renderizarCarrito() {
  const carrito       = obtenerCarrito();
  const contenedor    = document.getElementById('contenedor-carrito');
  const msgVacio      = document.getElementById('carrito-vacio');
  const totalEl       = document.getElementById('Total');
  const accionesEl    = document.getElementById('carrito-acciones');

  if (!contenedor) return;

  // Limpiar items anteriores (excepto msg-vacío y acciones)
  contenedor.querySelectorAll('.carrito-productos').forEach(el => el.remove());

  if (carrito.length === 0) {
    msgVacio.style.display  = 'block';
    accionesEl.style.display = 'none';
    if (totalEl) totalEl.textContent = '$0';
    return;
  }

  msgVacio.style.display   = 'none';
  accionesEl.style.display = 'flex';

  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const div = document.createElement('div');
    div.className  = 'carrito-productos';
    div.dataset.id = item.idProducto;
    div.innerHTML = `
      <img src="../IMG/${imagenItem(item.nombre)}" alt="${item.nombre}" onerror="this.src='../IMG/mesa01.png'">
      <div class="carrito-productos-titulo">
        <small>Artículo</small>
        <h3>${item.nombre}</h3>
      </div>
      <div class="carrito-productos-cantidad">
        <small>Cantidad</small>
        <div style="display:flex;align-items:center;gap:8px;">
          <button class="btn-cant" onclick="cambiarCantidad(${item.idProducto}, -1)">−</button>
          <p>${item.cantidad}</p>
          <button class="btn-cant" onclick="cambiarCantidad(${item.idProducto}, 1)">+</button>
        </div>
      </div>
      <div class="carrito-productos-precio">
        <small>Precio</small>
        <p>$${Number(item.precio).toLocaleString('es-CO')}</p>
      </div>
      <div class="carrito-productos-subtotal">
        <small>Subtotal</small>
        <p>$${subtotal.toLocaleString('es-CO')}</p>
      </div>
      <button class="carrito-productos-delate" onclick="eliminarItem(${item.idProducto})">
        <i class="bi bi-trash"></i>
      </button>
    `;
    // Insertar antes de las acciones
    accionesEl.before(div);
  });

  if (totalEl) totalEl.textContent = '$' + total.toLocaleString('es-CO');
  actualizarContadorCarrito();
}

function cambiarCantidad(id, delta) {
  const carrito = obtenerCarrito();
  const item    = carrito.find(x => x.idProducto === id);
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    if (!confirm(`¿Quitar "${item.nombre}" del carrito?`)) return;
    guardarCarrito(carrito.filter(x => x.idProducto !== id));
  } else {
    guardarCarrito(carrito);
  }
  renderizarCarrito();
}

function eliminarItem(id) {
  const carrito = obtenerCarrito();
  const item    = carrito.find(x => x.idProducto === id);
  if (item && confirm(`¿Eliminar "${item.nombre}"?`)) {
    guardarCarrito(carrito.filter(x => x.idProducto !== id));
    renderizarCarrito();
    mostrarToast('Producto eliminado del carrito.', 'warning');
  }
}

function vaciarCarrito() {
  if (!confirm('¿Vaciar todo el carrito?')) return;
  guardarCarrito([]);
  renderizarCarrito();
  mostrarToast('Carrito vaciado.', 'warning');
}

function procesarCompra() {
  const sesion = obtenerSesion();
  if (!sesion) {
    mostrarToast('Debes iniciar sesión para comprar.', 'error');
    setTimeout(() => window.location.href = '../login.html', 1500);
    return;
  }
  mostrarToast('¡Compra realizada con éxito! Gracias por tu pedido.', 'success');
  guardarCarrito([]);
  setTimeout(() => renderizarCarrito(), 2000);
}

function imagenItem(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes('sillón') || n.includes('sillon')) return 'sillon01.png';
  if (n.includes('mesa'))  return 'mesa01.png';
  if (n.includes('silla')) return '01.jpg';
  return 'mesa01.png';
}
