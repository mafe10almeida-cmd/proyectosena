package com.artemadera.dao;


import com.artemadera.database.Conexion;

import com.artemadera.models.Producto;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductoDAO {

    // CREATE: Insertar un nuevo mueble
    public void crear(String nombre, String descripcion, double precio, int stock) {
        String sql = "INSERT INTO producto (nombre, descripcion, precio, stock, estado) VALUES (?, ?, ?, ?, 'Disponible')";
        try (Connection con = Conexion.conectar();
            PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, nombre);
            ps.setString(2, descripcion);
            ps.setDouble(3, precio);
            ps.setInt(4, stock);
            ps.executeUpdate();
            System.out.println("Producto guardado exitosamente.");
        } catch (SQLException e) {
            System.out.println("Error al crear producto: " + e.getMessage());
        }
    }

    // READ: Listar todos los productos del catálogo
    public List<Producto> leerTodo() {
    List<Producto> lista = new ArrayList<>();
    String sql = "SELECT * FROM producto";

    try (Connection con = Conexion.conectar();
        Statement st = con.createStatement();
        ResultSet rs = st.executeQuery(sql)) {

        while (rs.next()) {
            Producto p = new Producto();
            p.setIdProducto(rs.getInt("id_producto"));
            p.setNombre(rs.getString("nombre"));
            p.setDescripcion(rs.getString("descripcion"));
            p.setPrecio(rs.getDouble("precio"));
            p.setStock(rs.getInt("stock"));
            p.setEstado(rs.getString("estado"));

            lista.add(p);
        }

    } catch (SQLException e) {
        System.out.println("Error al leer datos: " + e.getMessage());
    }

    return lista;
}

    // UPDATE: Actualizar precio y stock (Rol Administrador)
    public void actualizar(int id, double nuevoPrecio, int nuevoStock) {
        String sql = "UPDATE producto SET precio = ?, stock = ? WHERE id_producto = ?";
        try (Connection con = Conexion.conectar();
            PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setDouble(1, nuevoPrecio);
            ps.setInt(2, nuevoStock);
            ps.setInt(3, id);
            int filas = ps.executeUpdate();
            if (filas > 0) System.out.println("Producto ID " + id + " actualizado.");
        } catch (SQLException e) {
            System.out.println("Error al actualizar: " + e.getMessage());
        }
    }

    // DELETE: Eliminar un producto del sistema
    public void eliminar(int id) {
        String sql = "DELETE FROM producto WHERE id_producto = ?";
        try (Connection con = Conexion.conectar();
            PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
            System.out.println("Producto ID " + id + " eliminado correctamente.");
        } catch (SQLException e) {
            System.out.println("Error al eliminar: " + e.getMessage());
        }
    }
}