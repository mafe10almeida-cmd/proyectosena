package com.artemadera.controllers;

import com.artemadera.models.Producto;
import com.artemadera.repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    // GET — Listar todos
    @GetMapping
    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    // GET — Obtener uno por ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Integer id) {
        Optional<Producto> producto = productoRepository.findById(id);
        return producto.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST — Crear nuevo producto
    @PostMapping("/guardar")
    public ResponseEntity<Producto> guardar(@RequestBody Producto nuevoProducto) {
        nuevoProducto.setEstado("Disponible");
        Producto guardado = productoRepository.save(nuevoProducto);
        return ResponseEntity.ok(guardado);
    }

    // PUT — Actualizar producto existente
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable Integer id, @RequestBody Producto datos) {
        Optional<Producto> optional = productoRepository.findById(id);
        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        Producto producto = optional.get();
        producto.setNombre(datos.getNombre());
        producto.setDescripcion(datos.getDescripcion());
        producto.setPrecio(datos.getPrecio());
        producto.setStock(datos.getStock());
        producto.setEstado(datos.getEstado());

        return ResponseEntity.ok(productoRepository.save(producto));
    }

    // DELETE — Eliminar por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (!productoRepository.existsById(id)) return ResponseEntity.notFound().build();
        productoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
