// Importamos las funciones de imágenes que necesitamos
import { getAutoFiles, setAutoFiles, resetAutoFiles } from './ui.js';

// --- FUNCIONES PARA PRODUCTOS (AUTOS) ---
export async function loadProducts() {
    const productosContent = document.getElementById('productos-content');
    if (!productosContent) return;
    productosContent.innerHTML = '<p>Cargando productos...</p>';
    try {
        const response = await fetch('http://localhost:4000/api/autos'); 
        if (!response.ok) throw new Error('No se pudo obtener la lista de autos.');
        const autos = await response.json();

        if (autos.length === 0) {
            productosContent.innerHTML = '<p>No hay autos registrados.</p>';
            return;
        }

        let tablaHTML = `<div class="table-responsive mb-0"><table class="table table-striped table-hover"><thead><tr>
            <th>Modelo</th><th>Año</th><th>Precio</th><th>Imágenes</th><th>Acciones</th>
            </tr></thead><tbody>`;

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
        productosContent.innerHTML = tablaHTML;

        // Añadimos listeners a los botones de la tabla de autos
        document.querySelectorAll('.btn-editar-auto').forEach(button => {
            button.addEventListener('click', (e) => {
                editarAuto(e.currentTarget.dataset.id);
            });
        });
        document.querySelectorAll('.btn-eliminar-auto').forEach(button => {
            button.addEventListener('click', (e) => {
                eliminarAuto(e.currentTarget.dataset.id);
            });
        });

    } catch (error) {
        console.error("Error al cargar productos:", error);
        productosContent.innerHTML = `<p class="text-danger">${error.message || 'Error al cargar productos.'}</p>`;
    }
}

async function eliminarAuto(id) {
    if(confirm(`¿Estás seguro de que quieres eliminar el auto con ID: ${id}?`)) {
        try {
            const response = await fetch(`http://localhost:4000/api/autos/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'No se pudo eliminar el auto.');
            alert(data.msg || 'Auto eliminado.');
            loadProducts(); 
        } catch (error) {
            console.error("Error al eliminar auto:", error);
            alert(`Error: ${error.message}`);
        }
    }
}

async function editarAuto(id) {
    console.log(`Preparando para editar auto ID: ${id}`);
    try {
        const response = await fetch(`http://localhost:4000/api/autos/${id}`);
        if (!response.ok) throw new Error('No se pudo obtener los datos del auto.');
        const auto = await response.json();

        document.getElementById('autoId').value = auto._id;
        document.getElementById('autoModelo').value = auto.modelo;
        document.getElementById('autoAnio').value = auto.anio;
        document.getElementById('autoKilometraje').value = auto.kilometraje;
        document.getElementById('autoPrecio').value = auto.precio;
        document.getElementById('autoTransmision').value = auto.transmision;
        document.getElementById('autoColor').value = auto.color;
        
        // Usamos la función importada para cargar las imágenes existentes
        setAutoFiles(auto.imagenes); 

        document.getElementById('submitAutoBtn').textContent = 'Actualizar Auto';
        document.getElementById('cancelEditBtn').classList.remove('d-none');
        document.getElementById('auto-form').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error("Error al preparar edición:", error);
        alert(`Error: ${error.message}`);
    }
}

export function resetAutoForm() {
    const autoForm = document.getElementById('auto-form');
    if (autoForm) {
        autoForm.reset(); 
        document.getElementById('autoId').value = ''; 
        document.getElementById('submitAutoBtn').textContent = 'Guardar Auto'; 
        document.getElementById('cancelEditBtn').classList.add('d-none'); 
        
        resetAutoFiles(); 
    }
}

export async function handleAutoFormSubmit(e) {
    e.preventDefault();
    const autoId = document.getElementById('autoId').value; 
    
    // 1. Crear FormData
    const formData = new FormData();

    // 2. AÑADIR TODOS LOS CAMPOS DE TEXTO
    formData.append('modelo', document.getElementById('autoModelo').value);
    formData.append('anio', document.getElementById('autoAnio').value);
    formData.append('kilometraje', document.getElementById('autoKilometraje').value);
    formData.append('precio', document.getElementById('autoPrecio').value);
    formData.append('transmision', document.getElementById('autoTransmision').value);
    formData.append('color', document.getElementById('autoColor').value);
    
    // 3. OBTENER ARCHIVOS/URLS DESDE EL MÓDULO UI
    const autoImagenesList = getAutoFiles();
    
    const existingImageUrls = [];
    autoImagenesList.forEach(file => {
        if (file instanceof File) {
            // Si es un archivo nuevo, lo adjunta para Multer
            formData.append('imagenes', file, file.name); 
        } else if (typeof file === 'string') {
            // Si es una URL existente (string), la guarda en un array
            existingImageUrls.push(file); 
        }
    });
    
    // 4. AÑADIR ARRAY DE IMÁGENES EXISTENTES
    formData.append('existingImages', JSON.stringify(existingImageUrls));

    // 5. ENVIAR AL BACKEND
    const url = autoId ? `http://localhost:4000/api/autos/${autoId}` : 'http://localhost:4000/api/autos';
    const method = autoId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            body: formData // NO pongas 'Content-Type'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || `Error al ${autoId ? 'actualizar' : 'guardar'} el auto.`);

        alert(`Auto ${autoId ? 'actualizado' : 'añadido'} exitosamente.`);
        resetAutoForm(); 
        loadProducts(); 

    } catch (error) {
        console.error(`Error al ${autoId ? 'actualizar' : 'guardar'} auto:`, error);
        alert(`Error: ${error.message}`);
    }
}