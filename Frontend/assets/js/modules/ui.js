let vehiculoFiles = [];
let draggedItem = null;

export function getVehiculoFiles() { return vehiculoFiles; }

export function resetVehiculoFiles() {
    vehiculoFiles = [];
    document.getElementById("vehiculo-image-preview-container").innerHTML = "";
}

export function setVehiculoFiles(files) {
    vehiculoFiles = [...files];
    renderPreviews();
}

export function initVehiculoImageUploadInput(inputId) {
    const input = document.getElementById(inputId);

    input.addEventListener("change", () => {
        const newFiles = [...input.files];

        if (vehiculoFiles.length + newFiles.length > 4) {
            alert("Máximo 4 imágenes.");
            input.value = "";
            return;
        }

        vehiculoFiles.push(...newFiles);
        renderPreviews();
        input.value = "";
    });
}

function renderPreviews() {
    const container = document.getElementById("vehiculo-image-preview-container");
    container.innerHTML = "";

    vehiculoFiles.forEach((file, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "img-preview-wrapper";
        wrapper.dataset.index = index;
        wrapper.draggable = true;

        const img = document.createElement("img");
        img.className = "img-preview";

        img.src = file instanceof File ? URL.createObjectURL(file) : file;

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-img-btn";
        removeBtn.innerHTML = "&times;";
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            vehiculoFiles.splice(index, 1);
            renderPreviews();
        };

        wrapper.appendChild(img);
        wrapper.appendChild(removeBtn);

        addDragEvents(wrapper);

        container.appendChild(wrapper);
    });
}

function addDragEvents(item) {
    item.addEventListener("dragstart", () => {
        draggedItem = item;
        item.classList.add("dragging");
    });

    item.addEventListener("dragend", () => {
        draggedItem.classList.remove("dragging");
        draggedItem = null;
        updateFilesOrder();
    });

    item.addEventListener("dragover", (e) => {
        e.preventDefault();

        const container = document.getElementById("vehiculo-image-preview-container");
        const after = getDragAfter(container, e.clientX);

        if (after == null)
            container.appendChild(draggedItem);
        else
            container.insertBefore(draggedItem, after);
    });
}

function getDragAfter(container, x) {
    const items = [...container.querySelectorAll(".img-preview-wrapper:not(.dragging)")];
    let closest = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    items.forEach(item => {
        const box = item.getBoundingClientRect();
        const offset = x - (box.left + box.width / 2);

        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closest = item;
        }
    });

    return closest;
}

function updateFilesOrder() {
    const container = document.getElementById("vehiculo-image-preview-container");

    const newOrder = [...container.querySelectorAll(".img-preview-wrapper")]
        .map(div => parseInt(div.dataset.index));

    vehiculoFiles = newOrder.map(i => vehiculoFiles[i]);

    renderPreviews();
}