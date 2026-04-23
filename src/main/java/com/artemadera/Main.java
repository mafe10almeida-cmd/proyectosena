package com.artemadera;
import com.artemadera.dao.ProductoDAO;
import com.artemadera.models.Producto;

import java.util.List;

public class Main {
    public static void main(String[] args) {

        ProductoDAO dao = new ProductoDAO();

        boolean pruebaInsertar = false;

        if (pruebaInsertar) {
            System.out.println("Registrando producto...");
            dao.crear("Escritorio de Roble", "Escritorio artesanal de 120x60cm", 450000.00, 5);
        }

        System.out.println("\nLista de productos:");

        List<Producto> productos = dao.leerTodo();

        for (Producto p : productos) {
            System.out.println(
                "ID: " + p.getIdProducto() +
                " | Nombre: " + p.getNombre() +
                " | Precio: $" + p.getPrecio() +
                " | Stock: " + p.getStock() +
                " | Estado: " + p.getEstado()
            );
        }
    }
}