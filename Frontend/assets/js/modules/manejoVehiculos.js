import { obtenerArchivosVehiculo, establecerArchivosVehiculo, reiniciarArchivosVehiculo } from './manejoVisual.js';

const BASE_URL = "http://localhost:4000/api";

// --- FUNCIONES EXPORTADAS ---
export async function cargarVehiculos() {
    const contenedorTabla = document.getElementById("tablaVehiculos"); // <tbody> html
    const filtroEl = document.getElementById("filtroEstadoVehiculo");
    
    if (!contenedorTabla || !filtroEl) {
        console.error("Error: No se encontró #tablaVehiculos o #filtroEstadoVehiculo en el DOM.");
        return;
    }

    contenedorTabla.innerHTML = `<tr><td colspan="4" class="text-center py-3 text-muted">Cargando vehículos...</td></tr>`;
    const filtro = filtroEl.value;

    try {
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
        
        vehiculos.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));

        let vehiculosFiltrados = vehiculos;
        if (filtro === "activos") vehiculosFiltrados = vehiculos.filter(v => v.activo);
        if (filtro === "inactivos") vehiculosFiltrados = vehiculos.filter(v => !v.activo);

        renderTablaVehiculos(vehiculosFiltrados); // Llama a la función interna

    } catch (err) {
        console.error("Error:", err);
        contenedorTabla.innerHTML = `<tr><td colspan="4" class="text-center py-3 text-danger">${err.message}</td></tr>`;
    }
}

export async function editarVehiculo(id, tipo) {
    try {
        const response = await fetch(`${BASE_URL}/${tipo}s/${id}`);
        if (!response.ok) throw new Error("No se pudo obtener el vehículo.");
        const v = await response.json();

        document.getElementById("vehiculoId").value = v._id || "";
        document.getElementById("vehiculoTipo").value = tipo;
        document.getElementById("vehiculoModelo").value = v.modelo || "";
        document.getElementById("vehiculoAnio").value = v.anio || "";
        document.getElementById("vehiculoKilometraje").value = v.kilometraje || "";
        document.getElementById("vehiculoColor").value = v.color || "";
        document.getElementById("vehiculoPrecio").value = v.precio || "";

        if (tipo === "auto") {
            document.querySelector(".tipo-auto")?.classList.remove("d-none");
            document.querySelector(".tipo-moto")?.classList.add("d-none");
            if (document.getElementById("vehiculoTransmision")) document.getElementById("vehiculoTransmision").value = v.transmision || "";
        } else {
            document.querySelector(".tipo-auto")?.classList.add("d-none");
            document.querySelector(".tipo-moto")?.classList.remove("d-none");
            if (document.getElementById("vehiculoCilindrada")) document.getElementById("vehiculoCilindrada").value = v.cilindrada || "";
        }

        establecerArchivosVehiculo(v.imagenes || []);

        document.getElementById("submitVehiculoBtn").textContent = "Actualizar Vehículo";
        document.getElementById("cancelEditVehiculoBtn").classList.remove("d-none");
        document.getElementById("vehiculo-form").scrollIntoView({ behavior: "smooth" });

    } catch (err) {
        alert("Error al preparar la edición: " + err.message);
    }
}

export async function manejarSubmitVehiculo(e) {
    e.preventDefault();

    const id = document.getElementById("vehiculoId").value;
    const tipo = document.getElementById("vehiculoTipo").value;

    const formData = new FormData();
    formData.append("modelo", document.getElementById("vehiculoModelo").value);
    formData.append("anio", document.getElementById("vehiculoAnio").value);
    formData.append("kilometraje", document.getElementById("vehiculoKilometraje").value);
    formData.append("color", document.getElementById("vehiculoColor").value);
    formData.append("precio", document.getElementById("vehiculoPrecio").value);
    
    if (tipo === "auto") {
        formData.append("transmision", document.getElementById("vehiculoTransmision").value);
    } else {
        formData.append("cilindrada", document.getElementById("vehiculoCilindrada").value);
    }

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

    const url = id
        ? `${BASE_URL}/${tipo}s/${id}`
        : `${BASE_URL}/${tipo}s`;
    const method = id ? "PUT" : "POST";

    try {
        const res = await fetch(url, { method, body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Error en la operación.');

        alert(id ? "Vehículo actualizado." : "Vehículo añadido.");
        resetVehiculoForm();
        cargarVehiculos();

    } catch (err) {
        alert("Error: " + err.message);
    }
}

export function resetVehiculoForm() {
    const form = document.getElementById("vehiculo-form");
    if (form) form.reset();
    document.getElementById("vehiculoId").value = "";
    document.getElementById("submitVehiculoBtn").textContent = "Guardar Vehículo";
    document.getElementById("cancelEditVehiculoBtn").classList.add("d-none");

    document.querySelector(".tipo-auto")?.classList.remove("d-none");
    document.querySelector(".tipo-moto")?.classList.remove("d-none");
    
    reiniciarArchivosVehiculo();
}


// --- FUNCIONES INTERNAS ---
function renderTablaVehiculos(vehiculos) {
    const tablaBody = document.getElementById("tablaVehiculos"); 
    if (!tablaBody) return;
    
    tablaBody.innerHTML = ""; 

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

    // Reasigna listeners
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

async function toggleEstado(id, tipo, estadoActual) {
    const accion = estadoActual ? "desactivar" : "activar";
    if (!confirm(`¿Seguro que deseas ${accion} este ${tipo}?`)) return;

    try {
        const res = await fetch(`${BASE_URL}/${tipo}s/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo: !estadoActual }) // Envia estado opuesto
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg);

        alert(`Vehículo ${accion}do correctamente.`);
        cargarVehiculos();

    } catch (err) {
        alert("Error: " + err.message);
    }
}