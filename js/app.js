const API_URL = "http://localhost:8080/api/productos";
let productos = [];
let productoEditando = null;
const formatoMoneda = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const escapar = (texto) => String(texto).replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));

async function solicitar(url = API_URL, opciones = {}) {
    const respuesta = await fetch(url, { headers: { "Content-Type": "application/json", ...(opciones.headers || {}) }, ...opciones });
    if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => ({}));
        throw new Error(error.mensaje || error.detail || error.message || "No fue posible comunicarse con el servidor.");
    }
    return respuesta.status === 204 ? null : respuesta.json();
}

function iconoProducto(categoria) {
    return ({ "Tecnología": "bi-cpu", "Muebles": "bi-lamp", "Oficina": "bi-pencil-square", "Accesorios": "bi-usb-symbol" })[categoria] || "bi-box";
}

function estadoStock(cantidad) {
    return cantidad <= 5 ? '<span class="stock-badge low"><i class="bi bi-exclamation-circle"></i> Stock bajo</span>' : '<span class="stock-badge"><i class="bi bi-check-circle"></i> Disponible</span>';
}

async function cargarProductos() {

    productos = await solicitar();

    cargarFiltros();
    mostrarProductos();

    const resumen = await solicitar(`${API_URL}/dashboard`);

    actualizarInicio(resumen);
}


function mostrarProductos() {
    const tabla = document.getElementById("tablaProductos");
    if (!tabla) return;
    const texto = document.getElementById("searchInput")?.value.toLowerCase().trim() || "";
    const categoria = document.getElementById("categoryFilter")?.value || "";
    const filtrados = productos.filter((p) => (!texto || [p.codigo, p.nombre, p.categoria].some((v) => v.toLowerCase().includes(texto))) && (!categoria || p.categoria === categoria));
    tabla.innerHTML = filtrados.length ? filtrados.map((p) => `<tr><td><span class="product-name"><span class="product-icon"><i class="bi ${iconoProducto(p.categoria)}"></i></span>${escapar(p.nombre)}</span></td><td><span class="code">${escapar(p.codigo)}</span></td><td><span class="category-tag">${escapar(p.categoria)}</span></td><td>${formatoMoneda.format(p.precio)}</td><td><strong>${p.cantidad} unidades</strong>${estadoStock(p.cantidad)}</td><td class="actions-cell"><button class="icon-button edit" type="button" data-accion="editar" data-id="${p.id}" aria-label="Editar"><i class="bi bi-pencil"></i></button><button class="icon-button delete" type="button" data-accion="eliminar" data-id="${p.id}" aria-label="Eliminar"><i class="bi bi-trash3"></i></button></td></tr>`).join("") : '<tr><td class="empty-state" colspan="6"><i class="bi bi-inbox"></i><strong>No hay productos registrados</strong><span>Agrega el primer producto desde el botón superior.</span></td></tr>';
    document.getElementById("productCount").textContent = `${filtrados.length} producto${filtrados.length === 1 ? "" : "s"}`;
}

function cargarFiltros() {
    const filtro = document.getElementById("categoryFilter");
    if (!filtro) return;
    const actual = filtro.value;
    const categorias = [...new Set(productos.map((p) => p.categoria))].sort();
    filtro.innerHTML = '<option value="">Todas las categorías</option>' + categorias.map((c) => `<option value="${escapar(c)}">${escapar(c)}</option>`).join("");
    filtro.value = categorias.includes(actual) ? actual : "";
}

async function eliminarProducto(id) {
    const producto = productos.find((p) => p.id === id);
    if (!producto || !confirm(`¿Eliminar "${producto.nombre}" del inventario?`)) return;
    try { await solicitar(`${API_URL}/${id}`, { method: "DELETE" }); await cargarProductos(); }
    catch (error) { alert(error.message); }
}

function editarProducto(id) {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;
    sessionStorage.setItem("productoEditando", JSON.stringify(producto));
    window.location.href = "registrar.html";
}

function actualizarInicio(resumen) {

    if (!document.getElementById("totalProductos")) return;

    const categorias = [...new Set(productos.map((p) => p.categoria))];

    const unidades = productos.reduce(
        (total, p) => total + p.cantidad,
        0
    );

    // Datos principales obtenidos desde Spring Boot
    const totalProductos = resumen.totalProductos;
    const productosAgotados = resumen.productosAgotados;
    const valorInventario = Number(resumen.valorInventario);

    // Tarjetas principales del Dashboard
    document.getElementById("totalProductos").textContent = totalProductos;

    document.getElementById("totalCategorias").textContent =
        categorias.length;

    document.getElementById("unidadesDisponibles").textContent =
        unidades;

    document.getElementById("stockBajo").textContent =
        productosAgotados;

    document.getElementById("valorInventario").textContent =
        formatoMoneda.format(valorInventario);

    // Productos recientes
    document.getElementById("recentProducts").innerHTML =
        productos.slice(-4).reverse().map((p) => `
            <div class="recent-item">
                <span class="product-icon">
                    <i class="bi ${iconoProducto(p.categoria)}"></i>
                </span>

                <div>
                    <strong>${escapar(p.nombre)}</strong>
                    <small>
                        ${escapar(p.codigo)} · ${escapar(p.categoria)}
                    </small>
                </div>

                <div class="recent-stock">
                    <strong>${p.cantidad}</strong>
                    <small>unidades</small>
                </div>
            </div>
        `).join("") ||
        '<p class="empty-copy">No hay productos aún.</p>';

    // Categorías
    const total = productos.length || 1;

    document.getElementById("categoryList").innerHTML =
        categorias.map((c, i) => {

            const n = productos.filter(
                (p) => p.categoria === c
            ).length;

            return `
                <div class="category-row">
                    <span class="category-dot dot-${i % 4}"></span>

                    <div>
                        <strong>${escapar(c)}</strong>

                        <span>
                            <i style="width:${n / total * 100}%"></i>
                        </span>
                    </div>

                    <b>${n}</b>
                </div>
            `;

        }).join("") ||
        '<p class="empty-copy">Sin categorías.</p>';
}

function configurarFormulario() {
    const formulario = document.getElementById("formProducto");
    if (!formulario) return;
    productoEditando = JSON.parse(sessionStorage.getItem("productoEditando") || "null");
    if (productoEditando) {
        ["codigo", "nombre", "categoria", "precio", "cantidad"].forEach((campo) => document.getElementById(campo).value = productoEditando[campo]);
        document.getElementById("formTitle").textContent = "Editar producto";
        document.getElementById("saveButton").innerHTML = '<i class="bi bi-check-lg"></i> Actualizar producto';
        sessionStorage.removeItem("productoEditando");
    }
    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const datos = Object.fromEntries(new FormData(formulario));
        const producto = { codigo: datos.codigo.trim().toUpperCase(), nombre: datos.nombre.trim(), categoria: datos.categoria, precio: Number(datos.precio), cantidad: Number(datos.cantidad) };
        const alerta = document.getElementById("formAlert");
        if (!producto.codigo || !producto.nombre || !producto.categoria || producto.precio <= 0 || producto.cantidad < 0) { alerta.className = "form-alert error show"; alerta.innerHTML = '<i class="bi bi-exclamation-circle"></i> Completa todos los campos correctamente.'; return; }
        try {
            await solicitar(productoEditando ? `${API_URL}/${productoEditando.id}` : API_URL, { method: productoEditando ? "PUT" : "POST", body: JSON.stringify(producto) });
            alerta.className = "form-alert success show";
            alerta.innerHTML = `<i class="bi bi-check-circle"></i> Producto ${productoEditando ? "actualizado" : "registrado"} correctamente.`;
            setTimeout(() => window.location.href = "productos.html", 700);
        } catch (error) { alerta.className = "form-alert error show"; alerta.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${escapar(error.message)}`; }
    });
}
function exportarExcel() {

    if (!productos.length) {
        alert("No hay productos para exportar.");
        return;
    }

    const datos = productos.map((p) => ({
        "Producto": p.nombre,
        "Código": p.codigo,
        "Categoría": p.categoria,
        "Precio": p.precio,
        "Cantidad": p.cantidad,
        "Valor total": p.precio * p.cantidad
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, "Inventario");

    XLSX.writeFile(libro, "inventario_productos.xlsx");
}

document.addEventListener("DOMContentLoaded", async () => {
    configurarFormulario();

    document.getElementById("btnExportarExcel")?.addEventListener(
        "click",
        exportarExcel
    );

    document.getElementById("searchInput")?.addEventListener(
        "input",
        mostrarProductos
    );

    document.getElementById("categoryFilter")?.addEventListener(
        "change",
        mostrarProductos
    );

    document.getElementById("tablaProductos")?.addEventListener(
        "click",
        (evento) => {
            const boton = evento.target.closest("button[data-accion]");
            if (!boton) return;

            const id = Number(boton.dataset.id);

            boton.dataset.accion === "editar"
                ? editarProducto(id)
                : eliminarProducto(id);
        }
    );

    try {
        await cargarProductos();
    } catch (error) {
        const tabla = document.getElementById("tablaProductos");

        if (tabla) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="bi bi-wifi-off"></i>
                        <strong>Backend no conectado</strong>
                        <span>Inicia Spring Boot en el puerto 8080 y revisa MySQL.</span>
                    </td>
                </tr>
            `;
        }

        console.error(error);
    }
});
