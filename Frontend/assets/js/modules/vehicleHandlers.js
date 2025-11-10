import { getVehiculoFiles, setVehiculoFiles, resetVehiculoFiles } from './ui.js';

export async function loadVehicles() {
    const container = document.getElementById("vehiculos-content");
    if (!container) return;

    container.innerHTML = `<p>Cargando vehículos...</p>`;

    try {
        const [autosRes, motosRes] = await Promise.all([
            fetch("http://localhost:4000/api/autos"),
            fetch("http://localhost:4000/api/motos")
        ]);

        if (!autosRes.ok || !motosRes.ok)
            throw new Error("No se pudieron obtener los vehículos.");

        const autos = await autosRes.json();
        const motos = await motosRes.json();

        const vehiculos = [
            ...autos.map(a => ({ ...a, tipo: "auto" })),
            ...motos.map(m => ({ ...m, tipo: "moto" }))
        ];

        if (vehiculos.length === 0) {
            container.innerHTML = `<p>No hay vehículos registrados.</p>`;
            return;
        }

        let html = `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Modelo</th>
                            <th>Año</th>
                            <th>Precio</th>
                            <th>Imágenes</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        vehiculos.forEach(v => {
            html += `
                <tr>
                    <td class="text-center fs-4">${v.tipo === 'auto' ? '🚗' : '🏍️'}</td> 
                    <td>${v.modelo}</td>
                    <td>${v.anio}</td>
                    <td>u$s${v.precio.toLocaleString('es-AR')}</td>
                    <td>${v.imagenes.length}</td>
                    <td>
                        <button class="btn btn-info btn-sm me-1 btn-editar" data-id="${v._id}" data-tipo="${v.tipo}">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn btn-danger btn-sm btn-eliminar" data-id="${v._id}" data-tipo="${v.tipo}">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;
        container.innerHTML = html;

        document.querySelectorAll(".btn-editar").forEach(btn =>
            btn.addEventListener("click", () => editarVehiculo(btn.dataset.id, btn.dataset.tipo))
        );

        document.querySelectorAll(".btn-eliminar").forEach(btn =>
            btn.addEventListener("click", () => eliminarVehiculo(btn.dataset.id, btn.dataset.tipo))
        );

    } catch (err) {
        console.error("Error:", err);
        container.innerHTML = `<p class="text-danger">${err.message}</p>`;
    }
}

async function editarVehiculo(id, tipo) {
    try {
        const response = await fetch(`http://localhost:4000/api/${tipo + "s"}/${id}`);

        if (!response.ok) throw new Error("No se pudo obtener el vehículo.");

        const v = await response.json();

        document.getElementById("vehiculoId").value = v._id;
        document.getElementById("vehiculoTipo").value = tipo;

        document.getElementById("vehiculoModelo").value = v.modelo;
        document.getElementById("vehiculoAnio").value = v.anio;
        document.getElementById("vehiculoKilometraje").value = v.kilometraje;
        document.getElementById("vehiculoColor").value = v.color;
        document.getElementById("vehiculoPrecio").value = v.precio;

        if (tipo === "auto") {
            document.querySelector(".tipo-auto").classList.remove("d-none");
            document.querySelector(".tipo-moto").classList.add("d-none");

            document.getElementById("vehiculoTransmision").value = v.transmision;
        } else {
            document.querySelector(".tipo-auto").classList.add("d-none");
            document.querySelector(".tipo-moto").classList.remove("d-none");

            document.getElementById("vehiculoCilindrada").value = v.cilindrada;
        }

        setVehiculoFiles(v.imagenes);

        document.getElementById("submitVehiculoBtn").textContent = "Actualizar Vehículo";
        document.getElementById("cancelEditVehiculoBtn").classList.remove("d-none");

        document.getElementById("vehiculo-form").scrollIntoView({ behavior: "smooth" });

    } catch (err) {
        alert("Error al editar: " + err.message);
    }
}

async function eliminarVehiculo(id, tipo) {
    if (!confirm("¿Eliminar este vehículo?")) return;

    try {
        const res = await fetch(`http://localhost:4000/api/${tipo + "s"}/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg);

        alert("Vehículo eliminado.");
        loadVehicles();

    } catch (err) {
        alert("Error: " + err.message);
    }
}

export async function handleVehiculoFormSubmit(e) {
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

    const files = getVehiculoFiles();
    const existing = [];

    files.forEach(f => {
        if (f instanceof File) {
            formData.append("imagenes", f);
        } else {
            existing.push(f);
        }
    });

    formData.append("existingImages", JSON.stringify(existing));

    const url = id
        ? `http://localhost:4000/api/${tipo + "s"}/${id}`
        : `http://localhost:4000/api/${tipo + "s"}`;

    const method = id ? "PUT" : "POST";

    try {
        const res = await fetch(url, { method, body: formData });
        const data = await res.json();

        if (!res.ok) throw new Error(data.msg);

        alert(id ? "Vehículo actualizado." : "Vehículo añadido.");

        resetVehiculoForm();
        loadVehicles();

    } catch (err) {
        alert("Error: " + err.message);
    }
}

export function resetVehiculoForm() {
    document.getElementById("vehiculo-form").reset();

    document.getElementById("vehiculoId").value = "";
    document.getElementById("submitVehiculoBtn").textContent = "Guardar Vehículo";
    document.getElementById("cancelEditVehiculoBtn").classList.add("d-none");

    resetVehiculoFiles();
}