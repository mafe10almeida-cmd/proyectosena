package com.artemadera.repositories;

import com.artemadera.models.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    // ¡Magia! Spring Boot ya creó el CRUD por ti aquí.
}