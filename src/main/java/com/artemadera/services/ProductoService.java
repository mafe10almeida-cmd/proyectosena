package com.artemadera.services;

import com.artemadera.models.Producto;
import com.artemadera.repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> listarTodo() {
        return productoRepository.findAll();
    }

    public Optional<Producto> buscarPorId(Integer id) {
        return productoRepository.findById(id);
    }

    public Producto guardar(Producto producto) {
        validarCamposObligatorios(producto);
        aplicarReglasDeNegocio(producto);
        return productoRepository.save(producto);
    }

    public Producto actualizar(Integer id, Producto datosNuevos) {
        return productoRepository.findById(id).map(existente -> {
            validarCamposObligatorios(datosNuevos);
            
            existente.setNombre(datosNuevos.getNombre());
            existente.setDescripcion(datosNuevos.getDescripcion());
            existente.setPrecio(datosNuevos.getPrecio());
            existente.setStock(datosNuevos.getStock());
            
            // Mejora de seguridad: solo actualiza el estado si el usuario mandó algo válido
            // y el stock permite edición manual (1-2 unidades).
            if (datosNuevos.getStock() > 0 && datosNuevos.getStock() < 3) {
                if (datosNuevos.getEstado() != null && !datosNuevos.getEstado().isEmpty()) {
                    existente.setEstado(datosNuevos.getEstado());
                }
            }

            aplicarReglasDeNegocio(existente);
            return productoRepository.save(existente);
        }).orElseThrow(() -> new RuntimeException("Producto con ID " + id + " no encontrado."));
    }

    public void eliminar(Integer id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar: el ID " + id + " no existe.");
        }
        productoRepository.deleteById(id);
    }

    private void validarCamposObligatorios(Producto p) {
        if (p.getNombre() == null || p.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del mueble es obligatorio.");
        }
        if (p.getPrecio() <= 0) { 
            throw new IllegalArgumentException("El precio debe ser mayor a 0.");
        }
        if (p.getStock() < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo.");
        }
    }

    private void aplicarReglasDeNegocio(Producto p) {
        if (p.getStock() == 0) {
            p.setEstado("Agotado");
        } else if (p.getStock() >= 3) {
            p.setEstado("Disponible");
        }
        // Si stock es 1 o 2, se respeta el estado actual.
    }
}