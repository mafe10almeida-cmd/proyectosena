package com.artemadera.controllers;

import com.artemadera.models.Producto;
import com.artemadera.services.ProductoService; // 1. Importar el nuevo Service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    @Autowired
    private ProductoService productoService; // 2. Usar el Service en lugar del Repository

    // GET — Listar todos
    @GetMapping
    public List<Producto> listarTodos() {
        // Ahora el Service se encarga de buscar en la BD
        return productoService.listarTodo(); 
    }

    // GET — Obtener uno por ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Integer id) {
        // Nota: Si en tu Service no creaste 'buscarPorId', puedes llamar al repo 
        // o mejor, añadir ese método al Service para mantener el orden.
        return productoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST — Crear nuevo producto
    @PostMapping("/guardar")
    public ResponseEntity<Producto> guardar(@RequestBody Producto nuevoProducto) {
        // Ya no necesitas poner el estado a mano aquí, el Service lo hace solo
        Producto guardado = productoService.guardar(nuevoProducto);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    // PUT — Actualizar producto existente
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable Integer id, @RequestBody Producto datos) {
        // Toda la lógica de buscar, validar y setear campos ahora vive en el Service
        Producto actualizado = productoService.actualizar(id, datos);
        return ResponseEntity.ok(actualizado);
    }

    // DELETE — Eliminar por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}