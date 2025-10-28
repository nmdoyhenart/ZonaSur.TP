document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const previewContainer = document.getElementById('image-preview-container');
    let files = [];
    let draggedItem = null;

    imageUpload.addEventListener('change', () => {
        const newFiles = Array.from(imageUpload.files);
        if (files.length + newFiles.length > 4) {
            alert('Puedes subir un máximo de 4 imágenes.');
            return;
        }
        files.push(...newFiles);
        renderPreviews();
    });

    function renderPreviews() {
        previewContainer.innerHTML = '';
        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'img-preview-wrapper';
                wrapper.dataset.index = index;
                wrapper.draggable = true;

                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'img-preview';

                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-img-btn';
                removeBtn.innerHTML = '&times;';
                removeBtn.addEventListener('click', () => {
                    files.splice(index, 1);
                    renderPreviews();
                });
                
                wrapper.appendChild(img);
                wrapper.appendChild(removeBtn);
                previewContainer.appendChild(wrapper);

                addDragEvents(wrapper);
            };
            reader.readAsDataURL(file);
        });
    }
    
    function addDragEvents(item) {
        item.addEventListener('dragstart', () => {
            draggedItem = item;
            setTimeout(() => item.classList.add('dragging'), 0);
        });

        item.addEventListener('dragend', () => {
            setTimeout(() => {
                draggedItem.classList.remove('dragging');
                draggedItem = null;
            }, 0);
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(previewContainer, e.clientX);
            if (afterElement == null) {
                previewContainer.appendChild(draggedItem);
            } else {
                previewContainer.insertBefore(draggedItem, afterElement);
            }
        });
    }
    
    function getDragAfterElement(container, x) {
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
    
    // Simulación del envío del formulario
    const ventaForm = document.getElementById('venta-form');
    ventaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("Formulario enviado para aprobación (simulación).");
        console.log("Orden de imágenes:", files.map(f => f.name));
        // Aquí, en el futuro, enviaríamos los datos y los 'files' al backend.
        alert("Formulario enviado para revisión (simulación).");
    });
});