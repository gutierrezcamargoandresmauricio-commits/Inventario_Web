package com.sena.sistemainventario.model;

import java.math.BigDecimal;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "producto")
public class Producto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank @Size(max = 20) @Column(nullable = false, unique = true, length = 20)
    private String codigo;
    @NotBlank @Size(max = 100) @Column(nullable = false, length = 100)
    private String nombre;
    @NotBlank @Size(max = 100) @Column(nullable = false, length = 100)
    private String categoria;
    @NotNull @DecimalMin(value = "0.01") @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal precio;
    @NotNull @Min(0) @Column(nullable = false)
    private Integer cantidad;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo == null ? null : codigo.trim().toUpperCase(); }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre == null ? null : nombre.trim(); }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria == null ? null : categoria.trim(); }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}
