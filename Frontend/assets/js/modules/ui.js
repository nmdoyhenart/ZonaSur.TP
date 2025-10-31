
// Almacenamos los archivos/URLs en este módulo
let autoFiles = [];
let draggedItemAuto = null;

// Exportamos la función para OBTENER los archivos
export function getAutoFiles() {
    return autoFiles;
}

// Exportamos la función para REINICIAR los archivos
export function resetAutoFiles() {
    autoFiles = [];
    document.getElementById('auto-image-preview-container').innerHTML = '';
}

// Exportamos la función para INICIALIZAR los archivos (al editar)
export function setAutoFiles(files) {
    autoFiles = [...files];
    renderAutoPreviews();
}

// Exportamos el listener para el input de archivos
export function initImageUploadInput(inputId) {
    const autoImageUpload = document.getElementById(inputId);
    if (!autoImageUpload) return;

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

// --- Funciones internas del módulo (no se exportan) ---
function renderAutoPreviews() {
    const previewContainer = document.getElementById('auto-image-preview-container');
    previewContainer.innerHTML = '';
    
    autoFiles.forEach((file, index) => {
        let src = (file instanceof File) ? URL.createObjectURL(file) : file;
        const wrapper = createPreviewWrapper(src, index);
        previewContainer.appendChild(wrapper);
    });
}

function createPreviewWrapper(src, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'img-preview-wrapper';
    wrapper.dataset.index = index; // Índice actual en el array
    wrapper.draggable = true;

    const img = document.createElement('img');
    img.src = src;
    img.className = 'img-preview';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-img-btn';
    removeBtn.innerHTML = '&times;';
    removeBtn.onclick = (e) => { 
        e.stopPropagation(); 
        autoFiles.splice(index, 1);
        renderAutoPreviews();
    };
    
    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);
    addAutoDragEvents(wrapper);
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
            updateFilesOrder();
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

// ¡LÓGICA DE REORDENAMIENTO CORREGIDA!
function updateFilesOrder() {
    const previewContainer = document.getElementById('auto-image-preview-container');
    const originalIndices = [...previewContainer.querySelectorAll('.img-preview-wrapper')].map(w => parseInt(w.dataset.index));
    
    const reorderedFiles = originalIndices.map(idx => autoFiles[idx]);
    
    autoFiles = reorderedFiles;
    
    renderAutoPreviews();
    console.log("Orden de archivos actualizado.");
}