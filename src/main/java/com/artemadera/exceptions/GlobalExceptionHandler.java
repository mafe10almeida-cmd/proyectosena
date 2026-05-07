package com.artemadera.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Este método captura los errores de validación que definimos en el Service
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> manejarValidaciones(IllegalArgumentException ex) {
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("status", "400");
        respuesta.put("error", "Error de validación");
        respuesta.put("mensaje", ex.getMessage()); // Aquí aparecerá "El precio debe ser mayor a 0"
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
    }

    // Este método captura errores cuando algo no se encuentra (como un ID inexistente)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> manejarErroresGenerales(RuntimeException ex) {
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("status", "404");
        respuesta.put("error", "Recurso no encontrado");
        respuesta.put("mensaje", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
    }
}