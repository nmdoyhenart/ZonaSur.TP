import { obtenerArchivosVehiculo, establecerArchivosVehiculo, reiniciarArchivosVehiculo } from './manejoVisual.js';

const BASE_URL = "http://localhost:4000/api";

export async function cargarVehiculos() {
    const contenedorTabla = document.getElementById("tablaVehiculos");
    const filtroEl = document.getElementById("filtroEstadoVehiculo");
    
    if (!contenedorTabla || !filtroEl) {
        console.error("Error: No se encontró #tablaVehiculos o #filtroEstadoVehiculo en el DOM.");
        return;
    }

    contenedorTabla.innerHTML = `<tr><td colspan="4" class="text-center py-3 text-muted">Cargando vehículos...</td></tr>`;
    const filtro = filtroEl.value;

    try {
        // Se traen autos y motos en paralelo
        const [autosRes, motosRes] = await Promise.all([
            fetch(`${BASE_URL}/autos/`),
            fetch(`${BASE_URL}/motos/`)
        ]);

        if (!autosRes.ok || !motosRes.ok)
            throw new Error("No se pudieron obtener los vehículos.");

        const autos = await autosRes.json();
        const motos = await motosRes.json();

        let vehiculos = [
            ...autos.map(a => ({ ...a, tipo: "auto" })),
            ...motos.map(m => ({ ...m, tipo: "moto" }))
        ];
        
        // Ordenar del más nuevo al más viejo
        vehiculos.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));

        // Aplicar filtro de estado
        let vehiculosFiltrados = vehiculos;
        if (filtro === "activos") vehiculosFiltrados = vehiculos.filter(v => v.activo);
        if (filtro === "inactivos") vehiculosFiltrados = vehiculos.filter(v => !v.activo);

        renderTablaVehiculos(vehiculosFiltrados);

    } catch (err) {
        contenedorTabla.innerHTML = `<tr><td colspan="4" class="text-center py-3 text-danger">${err.message}</td></tr>`;
    }
}

export async function editarVehiculo(id, tipo) {
    try {
        const response = await fetch(`${BASE_URL}/${tipo}s/${id}`);
        if (!response.ok) throw new Error("No se pudo obtener el vehículo.");
        const v = await response.json();

        // Rellena inputs del formulario
        document.getElementById("vehiculoId").value = v._id || "";
        document.getElementById("vehiculoTipo").value = tipo;
        document.getElementById("vehiculoModelo").value = v.modelo || "";
        document.getElementById("vehiculoAnio").value = v.anio || "";
        document.getElementById("vehiculoKilometraje").value = v.kilometraje || "";
        document.getElementById("vehiculoColor").value = v.color || "";
        document.getElementById("vehiculoPrecio").value = v.precio || "";

        // Mostrar/ocultar campos según tipo
        if (tipo === "auto") {
            document.querySelector(".tipo-auto")?.classList.remove("d-none");
            document.querySelector(".tipo-moto")?.classList.add("d-none");
            document.getElementById("vehiculoTransmision").value = v.transmision || "";
        } else {
            document.querySelector(".tipo-auto")?.classList.add("d-none");
            document.querySelector(".tipo-moto")?.classList.remove("d-none");
            document.getElementById("vehiculoCilindrada").value = v.cilindrada || "";
        }

        // Cargar imagenes existentes al manejador visual
        establecerArchivosVehiculo(v.imagenes || []);

        // Cambiar a "Modo edición"
        document.getElementById("submitVehiculoBtn").textContent = "Actualizar Vehículo";
        document.getElementById("cancelEditVehiculoBtn").classList.remove("d-none");
        document.getElementById("vehiculo-form").scrollIntoView({ behavior: "smooth" });

    } catch (err) {
        Swal.fire("Error", err.message, "error");
    }
}

// Envio del form alta/baja
export async function manejarSubmitVehiculo(e) {
    e.preventDefault();

    const id = document.getElementById("vehiculoId").value;
    const tipo = document.getElementById("vehiculoTipo").value;

    // FormData quee envia datos + archivos
    const formData = new FormData();
    formData.append("modelo", document.getElementById("vehiculoModelo").value);
    formData.append("anio", document.getElementById("vehiculoAnio").value);
    formData.append("kilometraje", document.getElementById("vehiculoKilometraje").value);
    formData.append("color", document.getElementById("vehiculoColor").value);
    formData.append("precio", document.getElementById("vehiculoPrecio").value);
    
    // Campos según tipo
    if (tipo === "auto") {
        formData.append("transmision", document.getElementById("vehiculoTransmision").value);
    } else {
        formData.append("cilindrada", document.getElementById("vehiculoCilindrada").value);
    }

    // Manejo de imágenes nuevas y existentes
    const archivos = obtenerArchivosVehiculo();
    const existentes = [];

    archivos.forEach(f => {
        if (f instanceof File) {
            formData.append("imagenes", f);
        } else {
            existentes.push(f);
        }
    });

    formData.append("existingImages", JSON.stringify(existentes));

    // Determina si es Alta o Edición
    const url = id
        ? `${BASE_URL}/${tipo}s/${id}`
        : `${BASE_URL}/${tipo}s`;

    const method = id ? "PUT" : "POST";

    try {
        const res = await fetch(url, { method, body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Error en la operación.');

        Swal.fire(
            id ? "Actualizado" : "Añadido",
            id ? "Vehículo actualizado correctamente." : "Vehículo agregado correctamente.",
            "success"
        );

        resetVehiculoForm();
        cargarVehiculos();

    } catch (err) {
        Swal.fire("Error", err.message, "error");
    }
}

export function resetVehiculoForm() {
    const form = document.getElementById("vehiculo-form");
    if (form) form.reset();

    document.getElementById("vehiculoId").value = "";
    document.getElementById("submitVehiculoBtn").textContent = "Guardar Vehículo";
    document.getElementById("cancelEditVehiculoBtn").classList.add("d-none");

    // Mostrar ambos campos
    document.querySelector(".tipo-auto")?.classList.remove("d-none");
    document.querySelector(".tipo-moto")?.classList.remove("d-none");
    
    reiniciarArchivosVehiculo();
}

function renderTablaVehiculos(vehiculos) {
    const tablaBody = document.getElementById("tablaVehiculos");
    if (!tablaBody) return;
    
    tablaBody.innerHTML = "";

    // Si no hay resultados
    if (vehiculos.length === 0) {
        const colCount = 4;
        tablaBody.innerHTML = `
            <tr>
                <td colspan="${colCount}" class="text-center py-3 text-muted">
                    No hay vehículos que coincidan con el filtro.
                </td>
            </tr>
        `;
        return;
    }

    // Crear filas
    let filasHTML = "";

    vehiculos.forEach(v => {
        filasHTML += `
            <tr class="align-middle border-bottom border-secondary fila-vehiculo">
                <td class="text-center fs-4">${v.tipo === 'auto' ? '🚗' : '🏍️'}</td>
                <td class="fw-semibold py-2">${v.modelo || '-'}</td>
                <td class="py-2">
                    ${v.activo 
                        ? '<span class="badge bg-success px-2 py-1">Activo</span>' 
                        : '<span class="badge bg-danger px-2 py-1">Inactivo</span>'
                    }
                </td>
                <td class="text-end py-2">
                    <button class="btn btn-info btn-sm me-2 btn-editar-vehiculo"
                            data-id="${v._id}" data-tipo="${v.tipo}">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button class="btn btn-warning btn-sm btn-toggle-estado"
                            data-id="${v._id}"
                            data-tipo="${v.tipo}"
                            data-activo="${v.activo}">
                        <i class="bi ${v.activo ? 'bi-eye-slash' : 'bi-eye'}"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tablaBody.innerHTML = filasHTML;

    document.querySelectorAll(".btn-editar-vehiculo").forEach(btn =>
        btn.addEventListener("click", () =>
            editarVehiculo(btn.dataset.id, btn.dataset.tipo)
        )
    );

    document.querySelectorAll(".btn-toggle-estado").forEach(btn =>
        btn.addEventListener("click", () =>
            toggleEstado(btn.dataset.id, btn.dataset.tipo, btn.dataset.activo === "true")
        )
    );
}

// Activar / desactivar estado
async function toggleEstado(id, tipo, estadoActual) {
    const r = await Swal.fire({
        title: estadoActual ? "Desactivar vehículo" : "Activar vehículo",
        text: `¿Seguro que deseas ${estadoActual ? "desactivar" : "activar"} este ${tipo}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar"
    });

    if (!r.isConfirmed) return;

    try {
        // Enviar PUT solo con el estado invertido
        const res = await fetch(`${BASE_URL}/${tipo}s/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo: !estadoActual })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg);

        Swal.fire(
            "Listo",
            `Vehículo ${estadoActual ? "desactivado" : "activado"} correctamente.`,
            "success"
        );

        cargarVehiculos();

    } catch (err) {
        Swal.fire("Error", err.message, "error");
    }
}