package com.sena.sistemainventario.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.sena.sistemainventario.model.Producto;
import com.sena.sistemainventario.repository.ProductoRepository;

@Service
public class ProductoService {

    private final ProductoRepository repository;

    public ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }

    public List<Producto> listarProductos() {
        return repository.findAll();
    }

    public Producto guardarProducto(@NonNull Producto producto) {
        return repository.save(producto);
    }

    public Producto buscarPorId(@NonNull Long id) {
        return repository.findById(id).orElse(null);
    }

    public Optional<Producto> buscarPorCodigo(String codigo) {
        return repository.findByCodigo(codigo);
    }

    public Producto actualizarProducto(@NonNull Long id, @NonNull Producto datos) {

        Producto producto = repository.findById(id).orElse(null);

        if (producto == null) {
            return null;
        }

        producto.setCodigo(datos.getCodigo());
        producto.setNombre(datos.getNombre());
        producto.setCategoria(datos.getCategoria());
        producto.setPrecio(datos.getPrecio());
        producto.setCantidad(datos.getCantidad());

        return repository.save(producto);
    }

    public boolean eliminarProducto(@NonNull Long id) {

        if (!repository.existsById(id)) {
            return false;
        }

        repository.deleteById(id);
        return true;
    }
        // ==============================
    // ESTADÍSTICAS DEL DASHBOARD
    // ==============================

    public long contarProductos() {
        return repository.contarProductos();
    }

    public long contarAgotados() {
        return repository.contarAgotados();
    }

    public BigDecimal calcularValorInventario() {
        return repository.calcularValorInventario();
    }
}