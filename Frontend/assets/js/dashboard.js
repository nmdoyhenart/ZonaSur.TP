// assets/js/dashboard.js

// ===============================================================
// 1. DEFINICIONES DE FUNCIONES GLOBALES
// ===============================================================

// --- VARIABLES GLOBALES PARA IMÁGENES DE AUTOS ---
let autoFiles = []; // Almacena archivos (File) o URLs (string)
let draggedItemAuto = null;

// --- FUNCIONES PARA USUARIOS ---
async function loadUsers() {
    const usuariosContent = document.getElementById('usuarios-content'); 
    if (!usuariosContent) return; 
    usuariosContent.innerHTML = '<p>Cargando usuarios...</p>'; 
    try {
        const response = await fetch('http://localhost:4000/api/usuarios');
        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de usuarios.');
        }
        const usuarios = await response.json();
        
        if (usuarios.length === 0) {
            usuariosContent.innerHTML = '<p>No hay usuarios registrados.</p>';
            return;
        }

        let tablaHTML = `
            <div class="table-responsive mb-0"> 
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>ID</th>
                            <th>Usuario</th> 
                            <th>Fecha de registro</th>
                            <th>Administrador</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        usuarios.forEach(user => {
            tablaHTML += `
                <tr>
                    <td>${user.nombre}</td>
                    <td>${user._id}</td>
                    <td>${user.username || user.email || 'N/A'}</td> 
                    <td>${new Date(user.fechaRegistro).toLocaleDateString()}</td>
                    <td>${user.isAdmin ? '<i class="bi bi-check-circle-fill text-success"></i> Sí' : 'No'}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="eliminarUsuario('${user._id}')" title="Eliminar Usuario">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        tablaHTML += `</tbody></table></div>`;
        usuariosContent.innerHTML = tablaHTML; 

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        usuariosContent.innerHTML = `<p class="text-danger">${error.message || 'Error al cargar usuarios.'}</p>`;
    }
}

async function eliminarUsuario(id) {
    if(confirm(`¿Estás seguro de que quieres eliminar al usuario con ID: ${id}?`)) {
        try {
            const response = await fetch(`http://localhost:4000/api/usuarios/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'No se pudo eliminar el usuario.');
            alert(data.msg || 'Usuario eliminado.');
            loadUsers(); 
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert(`Error: ${error.message}`);
        }
    }
}

// --- FUNCIONES PARA PRODUCTOS (AUTOS) ---
async function loadProducts() {
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
                    <td>${auto.año}</td>
                    <td>u$s${auto.precio.toLocaleString('es-AR')}</td>
                    <td>${auto.imagenes.length}</td>
                    <td>
                        <button class="btn btn-sm btn-info me-1" onclick="editarAuto('${auto._id}')" title="Editar">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarAuto('${auto._id}')" title="Eliminar">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        tablaHTML += `</tbody></table></div>`;
        productosContent.innerHTML = tablaHTML;

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
        document.getElementById('autoAño').value = auto.año;
        document.getElementById('autoKilometraje').value = auto.kilometraje;
        document.getElementById('autoPrecio').value = auto.precio;
        document.getElementById('autoTransmision').value = auto.transmision;
        document.getElementById('autoColor').value = auto.color;
        
        // Carga las imágenes existentes en el array global y las muestra
        autoFiles = [...auto.imagenes]; // Guarda las URLs como strings
        renderAutoPreviews(); // Muestra las imágenes

        document.getElementById('submitAutoBtn').textContent = 'Actualizar Auto';
        document.getElementById('cancelEditBtn').classList.remove('d-none');
        document.getElementById('auto-form').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
         console.error("Error al preparar edición:", error);
         alert(`Error: ${error.message}`);
    }
}

function resetAutoForm() {
    const autoForm = document.getElementById('auto-form');
    if (autoForm) {
        autoForm.reset(); 
        document.getElementById('autoId').value = ''; 
        document.getElementById('submitAutoBtn').textContent = 'Guardar Auto'; 
        document.getElementById('cancelEditBtn').classList.add('d-none'); 
        
        // Limpia las vistas previas y el array de archivos
        autoFiles = []; 
        document.getElementById('auto-image-preview-container').innerHTML = '';
    }
}

// --- FUNCIONES PARA VISTA PREVIA Y DRAG & DROP DE IMÁGENES ---

function renderAutoPreviews() {
    const previewContainer = document.getElementById('auto-image-preview-container');
    previewContainer.innerHTML = '';
    
    // Creamos un array temporal de los archivos actuales para no mutar mientras iteramos
    const currentFiles = [...autoFiles]; 
    
    currentFiles.forEach((file, index) => {
        let src;
        let isFile = file instanceof File;

        if (isFile) {
            // Es un archivo nuevo, creamos un lector
            const reader = new FileReader();
            reader.onload = (e) => {
                const wrapper = createPreviewWrapper(e.target.result, index);
                previewContainer.appendChild(wrapper);
            };
            reader.readAsDataURL(file);
        } else if (typeof file === 'string') {
            // Es una URL existente (string)
            src = file; // La ruta ya es usable (ej: ../img/auto.jpg)
            const wrapper = createPreviewWrapper(src, index);
            previewContainer.appendChild(wrapper);
        }
    });
}

function createPreviewWrapper(src, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'img-preview-wrapper';
    wrapper.dataset.index = index; // Usamos el índice actual
    wrapper.draggable = true;

    const img = document.createElement('img');
    img.src = src;
    img.className = 'img-preview';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button'; // Evita que envíe el formulario
    removeBtn.className = 'remove-img-btn';
    removeBtn.innerHTML = '&times;';
    removeBtn.onclick = (e) => { 
        e.stopPropagation(); // Previene que se active el drag
        autoFiles.splice(index, 1); // Elimina el archivo del array global
        renderAutoPreviews(); // Re-renderiza las vistas previas
    };
    
    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);
    addAutoDragEvents(wrapper); // Añade eventos de arrastre
    return wrapper;
}

function addAutoDragEvents(item) {
    item.addEventListener('dragstart', (e) => {
        draggedItemAuto = item;
        setTimeout(() => item.classList.add('dragging'), 0);
    });
    item.addEventListener('dragend', () => {
        setTimeout(() => {
            if(draggedItemAuto) draggedItemAuto.classList.remove('dragging');
            draggedItemAuto = null;
            updateFilesOrder(); // Reordena el array global
        }, 0);
    });
    item.addEventListener('dragover', (e) => {
        e.preventDefault();
        const previewContainer = document.getElementById('auto-image-preview-container');
        const afterElement = getDragAfterElementAuto(previewContainer, e.clientX);
        if (afterElement == null) {
            previewContainer.appendChild(draggedItemAuto);
        } else {
            previewContainer.insertBefore(draggedItemAuto, afterElement);
        }
    });
}

function getDragAfterElementAuto(container, x) {
    const draggableElements = [...container.querySelectorAll('.img-preview-wrapper:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateFilesOrder() {
    const previewContainer = document.getElementById('auto-image-preview-container');
    const newFilesOrder = [];
    // Lee el nuevo orden del DOM
    previewContainer.querySelectorAll('.img-preview-wrapper').forEach(wrapper => {
        // Busca el archivo/string original en autoFiles usando el src o el dataset
        // Esta es una forma simple: reconstruye el array basado en el índice
        const index = parseInt(wrapper.dataset.index);
        newFilesOrder.push(autoFiles[index]);
    });
    
    // Reconstruye el array autoFiles basado en el orden del DOM
    const reorderedFiles = [];
    previewContainer.querySelectorAll('.img-preview-wrapper').forEach(wrapper => {
        const index = parseInt(wrapper.dataset.index); // Índice original
        reorderedFiles.push(autoFiles.find((file, i) => i === index)); // Encuentra el archivo/url
    });
    
    // Mejor: Reconstruir 'autoFiles' basado en el DOM
    const wrappers = [...previewContainer.querySelectorAll('.img-preview-wrapper')];
    autoFiles = wrappers.map(wrapper => {
        // Vuelve a encontrar el archivo original basado en el índice
        // Nota: esto es complejo porque los índices cambian. 
        // Una mejor forma sería reordenar autoFiles directamente.
        
        // --- Lógica de Reordenamiento Simplificada ---
        // Al final del drag, reconstruimos 'autoFiles' basado en el DOM.
        // Primero, leemos los índices *originales* del DOM.
        const originalIndices = [...previewContainer.querySelectorAll('.img-preview-wrapper')].map(w => parseInt(w.dataset.index));
        // Creamos un nuevo array basado en ese orden
        const tempArray = originalIndices.map(idx => autoFiles[idx]);
        autoFiles = tempArray;
        // Re-renderizamos para actualizar los data-index a 0, 1, 2, 3...
        renderAutoPreviews();
    });
    
    console.log("Orden de archivos actualizado.");
}


// --- OTRAS FUNCIONES DE CARGA (PLACEHOLDERS) ---
function loadReservations() { console.log('Llamando a loadReservations...'); }
function loadStatistics() { console.log('Llamando a loadStatistics...'); }


// ===============================================================
// 2. CÓDIGO QUE SE EJECUTA CUANDO EL DOM ESTÁ LISTO
// ===============================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("Dashboard cargado.");

    // Obtener referencias a elementos
    const usuariosTab = document.getElementById('usuarios-tab');
    const productosTab = document.getElementById('productos-tab');
    const addUserForm = document.getElementById('add-user-form');
    const autoForm = document.getElementById('auto-form'); 
    const cancelEditBtn = document.getElementById('cancelEditBtn'); 
    const logoutBtn = document.getElementById('logoutBtn');
    const autoImageUpload = document.getElementById('autoImageUpload'); // Input de archivos
    
    // --- LISTENER PARA INPUT DE IMÁGENES DE AUTO ---
    if (autoImageUpload) {
        autoImageUpload.addEventListener('change', () => {
            const newFiles = Array.from(autoImageUpload.files);
            if (autoFiles.length + newFiles.length > 4) {
                alert('Puedes subir un máximo de 4 imágenes.');
                autoImageUpload.value = null; 
                return;
            }
            autoFiles.push(...newFiles); 
            renderAutoPreviews();
            autoImageUpload.value = null;
        });
    }

    // --- LISTENERS PARA PESTAÑAS ---
    if(usuariosTab) {
        usuariosTab.addEventListener('shown.bs.tab', () => loadUsers());
    }
    if (productosTab) {
        productosTab.addEventListener('shown.bs.tab', () => loadProducts());
    }
    // ... (añadir listeners para otras pestañas) ...

    // --- LISTENER PARA FORMULARIO AÑADIR USUARIO ---
    if (addUserForm) {
        addUserForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // ... (lógica para añadir usuario sin cambios) ...
            const nombre = document.getElementById('addUserName').value.trim();
            const username = document.getElementById('addUserUsername').value.trim() || undefined;
            const isAdmin = document.getElementById('addUserIsAdminCheck').checked;
            const passwordInput = document.getElementById('addUserPassword');
            const password = passwordInput.value; 

            if (isAdmin && (!username || !password)) {
                alert('Para administradores, el Username y la Contraseña son obligatorios.');
                passwordInput.focus();
                return;
            }

            const nuevoUsuario = { nombre, isAdmin };
            if (username) nuevoUsuario.username = username; 
            if (isAdmin && password) nuevoUsuario.password = password;

            try {
                const response = await fetch('http://localhost:4000/api/usuarios/registro', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(nuevoUsuario)
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.msg || 'Error al añadir usuario.');
                alert('Usuario añadido exitosamente.');
                addUserForm.reset();
                loadUsers(); 
            } catch (error) {
                console.error("Error al añadir usuario:", error);
                alert(`Error: ${error.message}`);
            }
        });
    }

    // --- LISTENER PARA FORMULARIO AUTOS (AÑADIR/EDITAR) ---
    if (autoForm) {
        autoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const autoId = document.getElementById('autoId').value; 
            
            // 1. Usa FormData para enviar archivos y texto
            const formData = new FormData();
            formData.append('modelo', document.getElementById('autoModelo').value);
            formData.append('año', document.getElementById('autoAño').value);
            formData.append('kilometraje', document.getElementById('autoKilometraje').value);
            formData.append('precio', document.getElementById('autoPrecio').value);
            formData.append('transmision', document.getElementById('autoTransmision').value);
            formData.append('color', document.getElementById('autoColor').value);
            
            // 2. Separa archivos nuevos de URLs existentes
            const archivosNuevos = autoFiles.filter(f => f instanceof File);
            const urlsExistentes = autoFiles.filter(f => typeof f === 'string');
            
            // 3. Adjunta los archivos nuevos
            archivosNuevos.forEach(file => {
                formData.append('imagenes', file); // 'imagenes' debe coincidir con multer
            });

            // 4. Adjunta las URLs existentes como un string JSON
            if (autoId) { // Solo en modo edición
                 formData.append('existingImages', JSON.stringify(urlsExistentes));
            }

            const url = autoId 
                ? `http://localhost:4000/api/autos/${autoId}` 
                : 'http://localhost:4000/api/autos';         
            const method = autoId ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, {
                    method: method,
                    // 5. NO establezcas Content-Type, el navegador lo hará
                    body: formData 
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
        });
    }

    // --- LISTENER PARA BOTÓN CANCELAR EDICIÓN (AUTOS) ---
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            resetAutoForm(); // Llama a la función global para limpiar
        });
    }

    // --- LISTENER PARA CERRAR SESIÓN ---
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log("Cerrando sesión...");
            window.location.href = 'home.html'; 
        });
    }

    // --- CARGA INICIAL DE DATOS SEGÚN PESTAÑA ACTIVA ---
    if (document.querySelector('#usuarios-panel.active')) { loadUsers(); }
    if (document.querySelector('#productos-panel.active')) { loadProducts(); } 
});