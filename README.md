# Sistema de Inventario

El proyecto ya incluye el frontend y el backend para registrar, listar, editar, buscar, filtrar y eliminar productos usando MySQL.

## 1. Crear la base de datos

1. Abre MySQL Workbench o phpMyAdmin de XAMPP.
2. Abre el archivo `database.sql`, copia su contenido y ejecútalo.

## 2. Configurar la contraseña de MySQL

Abre `backend/src/main/resources/application.properties` y cambia solo esta parte:

```properties
spring.datasource.password=TU_CONTRASENA
```

Si MySQL no tiene contraseña (configuración frecuente de XAMPP), déjalo así:

```properties
spring.datasource.password=
```

## 3. Ejecutar el backend

1. Abre la carpeta `backend` en VS Code.
2. Instala las extensiones **Extension Pack for Java** y **Spring Boot Extension Pack** si VS Code las solicita.
3. Abre `SistemaInventarioApplication.java` y presiona **Run** sobre el método `main`.
4. Espera el mensaje que indica que la aplicación se inició en el puerto 8080.

## 4. Ejecutar el frontend

1. Abre la carpeta principal `Inventario_Web` en VS Code.
2. Abre `index.html` con la extensión **Live Server**.
3. Prueba registrar un producto, editarlo desde Productos y eliminarlo.

No cierres la terminal donde se ejecuta Spring Boot mientras uses la página. El frontend utiliza `http://localhost:8080/api/productos` y el backend guarda los datos en MySQL.
