/**
 * shop.js — Catálogo de Productos (Tienda)
 * Carga productos desde la API y permite agregarlos al carrito.
 */

const API_URL = 'http://localhost:8080/api/productos';

document.addEventListener('DOMContentLoaded', () => {
  cargarCatalogo();
});

async function cargarCatalogo() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Sin respuesta del servidor.');
    const productos = await res.json();
    renderizarCatalogo(productos);
  } catch {
    // Modo demo sin backend
    renderizarCatalogo(productosDemo());
  }
}

function renderizarCatalogo(productos) {
  const contenedor = document.getElementById('catalogo-productos');
  if (!contenedor) return;

  const disponibles = productos.filter(p => p.estado === 'Disponible');

  if (disponibles.length === 0) {
    contenedor.innerHTML = '<p style="color:#aaa;grid-column:1/-1;">No hay productos disponibles.</p>';
    return;
  }

  contenedor.innerHTML = disponibles.map(p => `
    <div class="tarjeta-producto">
      <div class="tarjeta-imagen">
        <img src="../IMG/${imagenPorNombre(p.nombre)}" alt="${p.nombre}" onerror="this.src='../IMG/mesa01.png'">
      </div>
      <div class="tarjeta-info">
        <h3>${p.nombre}</h3>
        <p>${p.descripcion || ''}</p>
        <span class="tarjeta-precio">$${Number(p.precio).toLocaleString('es-CO')}</span>
        <span class="badge-disponible">Disponible</span>
      </div>
      <button class="btn-agregar" onclick="agregarAlCarrito(${JSON.stringify(p).replace(/"/g, '&quot;')})">
        <i class="bi bi-cart-plus"></i> Agregar
      </button>
    </div>
  `).join('');
}

function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();
  const existente = carrito.find(item => item.idProducto === producto.idProducto);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito(carrito);
  mostrarToast(`"${producto.nombre}" agregado al carrito 🛒`, 'success');
}

function imagenPorNombre(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes('sillón') || n.includes('silloN') || n.includes('sillon')) return 'sillon01.png';
  if (n.includes('mesa'))  return 'mesa01.png';
  if (n.includes('silla')) return '01.jpg';
  return 'mesa01.png';
}

function productosDemo() {
  return [
    { idProducto: 1, nombre: 'Sillón Valencia',   descripcion: 'Sillón de cuero premium',      precio: 800000,  stock: 5, estado: 'Disponible' },
    { idProducto: 2, nombre: 'Mesa Roble',         descripcion: 'Mesa de comedor en roble',      precio: 1200000, stock: 3, estado: 'Disponible' },
    { idProducto: 4, nombre: 'Cama King Nogal',    descripcion: 'Cama doble en madera de nogal', precio: 2500000, stock: 4, estado: 'Disponible' },
  ];
}
