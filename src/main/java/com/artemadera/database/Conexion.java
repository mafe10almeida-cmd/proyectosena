package com.artemadera.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexion {
    // Definimos los datos arriba para que sea más ordenado
    private static final String URL = "jdbc:mysql://localhost:3306/ArteMadera";
    private static final String USUARIO = "root";
    private static final String PASSWORD = "";

    // ESTE ES EL MÉTODO QUE TU DAO NECESITA
    public static Connection conectar() throws SQLException {
        try {
            // Cargamos el driver (opcional en versiones nuevas, pero buena práctica)
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection(URL, USUARIO, PASSWORD);
        } catch (ClassNotFoundException e) {
            throw new SQLException("Driver no encontrado: " + e.getMessage());
        }
    }

    // Dejamos el main solo para que puedas seguir probando con "Run"
    public static void main(String[] args) {
        try {
            Connection con = conectar();
            if (con != null) {
                System.out.println("✅ ¡Éxito! Conexión establecida con ArteMadera.");
                con.close(); // Cerramos la prueba
            }
        } catch (SQLException e) {
            System.out.println("❌ Error de conexión: " + e.getMessage());
        }
    }
}