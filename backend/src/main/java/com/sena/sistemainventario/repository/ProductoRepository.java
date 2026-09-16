package com.sena.sistemainventario.repository;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.sena.sistemainventario.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    Optional<Producto> findByCodigo(String codigo);

    // Cantidad de productos registrados
    @Query("SELECT COUNT(p) FROM Producto p")
    long contarProductos();

    // Cantidad de productos agotados
    @Query("SELECT COUNT(p) FROM Producto p WHERE p.cantidad = 0")
    long contarAgotados();

    // Valor total del inventario
    @Query("SELECT COALESCE(SUM(p.precio * p.cantidad), 0) FROM Producto p")
    BigDecimal calcularValorInventario();
}