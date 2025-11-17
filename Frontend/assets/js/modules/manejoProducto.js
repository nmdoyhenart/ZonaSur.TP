import { obtenerArchivosVehiculo, establecerArchivosVehiculo, reiniciarArchivosVehiculo } from './manejoVisual.js';

export async function cargarProductos() {
    const contenedorProductos = document.getElementById('productos-content');
    if (!contenedorProductos) return;

    contenedorProductos.innerHTML = '<p>Cargando productos...</p>';

    try {
        const respuesta = await fetch('http://localhost:4000/api/autos');
        if (!respuesta.ok) throw new Error('No se pudo obtener la lista de autos.');

        const autos = await respuesta.json();

        if (autos.length === 0) {
            contenedorProductos.innerHTML = '<p>No hay autos registrados.</p>';
            return;
        }

        // --- Generación de la tabla ---
        let tablaHTML = `
        <div class="table-responsive mb-0">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Modelo</th>
                        <th>Año</th>
                        <th>Precio</th>
                        <th>Imágenes</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody">
        `;

        autos.forEach(auto => {
            tablaHTML += `
                <tr>
                    <td>${auto.modelo}</td>
                    <td>${auto.anio}</td>
                    <td>u$s${auto.precio.toLocaleString('es-AR')}</td>
                    <td>${auto.imagenes.length}</td>

                    <td>
                        <button class="btn btn-sm btn-info me-1 btn-editar-auto" data-id="${auto._id}" title="Editar">
                            <i class="bi bi-pencil-fill"></i>
                        </button>

                        <button class="btn btn-sm btn-danger btn-eliminar-auto" data-id="${auto._id}" title="Eliminar">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tablaHTML += `</tbody></table></div>`;
        contenedorProductos.innerHTML = tablaHTML;

        // Activar botones de editar
        document.querySelectorAll('.btn-editar-auto').forEach(btn => {
            btn.addEventListener('click', e => {
                editarAuto(e.currentTarget.dataset.id);
            });
        });

        // Activar botones de eliminar
        document.querySelectorAll('.btn-eliminar-auto').forEach(btn => {
            btn.addEventListener('click', e => {
                eliminarAuto(e.currentTarget.dataset.id);
            });
        });

    } catch (error) {
        console.error("Error al cargar productos:", error);
        contenedorProductos.innerHTML =
            `<p class="text-danger">${error.message || 'Error al cargar productos.'}</p>`;
    }
}

async function eliminarAuto(id) {
    if (!confirm(`¿Estás seguro de que quieres eliminar el auto con ID: ${id}?`))
        return;

    try {
        const respuesta = await fetch(`http://localhost:4000/api/autos/${id}`, { method: 'DELETE' });
        const data = await respuesta.json();

        if (!respuesta.ok) throw new Error(data.msg || 'No se pudo eliminar el auto.');

        alert(data.msg || 'Auto eliminado correctamente.');
        cargarProductos();

    } catch (error) {
        console.error("Error al eliminar auto:", error);
        alert(`Error: ${error.message}`);
    }
}

async function editarAuto(id) {
    try {
        const respuesta = await fetch(`http://localhost:4000/api/autos/${id}`);
        if (!respuesta.ok) throw new Error('No se pudo obtener los datos del auto.');

        const auto = await respuesta.json();

        // --- Cargar datos en inputs ---
        document.getElementById('autoId').value = auto._id;
        document.getElementById('autoModelo').value = auto.modelo;
        document.getElementById('autoAnio').value = auto.anio;
        document.getElementById('autoKilometraje').value = auto.kilometraje;
        document.getElementById('autoPrecio').value = auto.precio;
        document.getElementById('autoTransmision').value = auto.transmision;
        document.getElementById('autoColor').value = auto.color;

        // Cargar vistas previas desde URLs
        establecerArchivosVehiculo(auto.imagenes);

        // Cambiar botones
        document.getElementById('submitAutoBtn').textContent = 'Actualizar Auto';
        document.getElementById('cancelEditBtn').classList.remove('d-none');

        document.getElementById('auto-form').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error("Error al preparar edición:", error);
        alert(`Error: ${error.message}`);
    }
}

// Resetear formulario de autos
export function reiniciarFormularioAuto() {
    const formulario = document.getElementById('auto-form');
    if (!formulario) return;

    formulario.reset();
    document.getElementById('autoId').value = '';

    document.getElementById('submitAutoBtn').textContent = 'Guardar Auto';
    document.getElementById('cancelEditBtn').classList.add('d-none');

    // Resetear imágenes del módulo visual
    reiniciarArchivosVehiculo();
}

// Crear / Actualizar auto
export async function enviarFormularioAuto(e) {

    e.preventDefault();

    const autoId = document.getElementById('autoId').value;

    // --- FormData permite enviar archivos ---
    const formData = new FormData();

    formData.append('modelo', document.getElementById('autoModelo').value);
    formData.append('anio', document.getElementById('autoAnio').value);
    formData.append('kilometraje', document.getElementById('autoKilometraje').value);
    formData.append('precio', document.getElementById('autoPrecio').value);
    formData.append('transmision', document.getElementById('autoTransmision').value);
    formData.append('color', document.getElementById('autoColor').value);

    // Obtener imágenes desde manejoVisual.js
    const listaImagenes = obtenerArchivosVehiculo();
    const urlsExistentes = [];

    listaImagenes.forEach(archivo => {
        if (archivo instanceof File) {
            formData.append('imagenes', archivo, archivo.name);
        } else if (typeof archivo === 'string') {
            urlsExistentes.push(archivo);
        }
    });

    // Enviar URLs existentes como JSON
    formData.append('existingImages', JSON.stringify(urlsExistentes));

    const url = autoId
        ? `http://localhost:4000/api/autos/${autoId}`
        : 'http://localhost:4000/api/autos';

    const metodo = autoId ? 'PUT' : 'POST';

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            body: formData
        });

        const data = await respuesta.json();

        if (!respuesta.ok)
            throw new Error(data.msg || `Error al ${autoId ? 'actualizar' : 'guardar'} el auto.`);

        alert(`Auto ${autoId ? 'actualizado' : 'guardado'} exitosamente.`);

        reiniciarFormularioAuto();
        cargarProductos();

    } catch (error) {
        console.error("Error al guardar/actualizar:", error);
        alert(`Error: ${error.message}`);
    }
}