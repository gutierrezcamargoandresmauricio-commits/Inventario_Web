CREATE DATABASE IF NOT EXISTS sistema_inventario;
USE sistema_inventario;

CREATE TABLE IF NOT EXISTS producto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    precio DECIMAL(12,2) NOT NULL,
    cantidad INT NOT NULL
);
