package com.sena.sistemainventario.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.sena.sistemainventario.model.Producto;
import com.sena.sistemainventario.service.ProductoService;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Producto> listar() {
        return service.listarProductos();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Producto crear(@Valid @RequestBody Producto producto) {

        if (service.buscarPorCodigo(producto.getCodigo()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un producto con ese código.");
        }

        return service.guardarProducto(producto);
    }

    @PutMapping("/{id}")
    public Producto actualizar(
            @PathVariable @NonNull Long id,
            @Valid @RequestBody Producto datos) {

        Producto producto = service.buscarPorId(id);

        if (producto == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Producto no encontrado.");
        }

        service.buscarPorCodigo(datos.getCodigo())
                .filter(existente -> !existente.getId().equals(id))
                .ifPresent(existente -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Ya existe un producto con ese código.");
                });

        return service.actualizarProducto(id, datos);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable @NonNull Long id) {

        if (!service.eliminarProducto(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Producto no encontrado.");
        }
    }

    // ==============================
    // DASHBOARD
    // ==============================

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {

        Map<String, Object> datos = new HashMap<>();

        long totalProductos = service.contarProductos();
        long productosAgotados = service.contarAgotados();
        BigDecimal valorInventario = service.calcularValorInventario();

        datos.put("totalProductos", totalProductos);
        datos.put("productosAgotados", productosAgotados);
        datos.put("valorInventario", valorInventario);

        return datos;
    }
}