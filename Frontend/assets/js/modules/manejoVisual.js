// Módulo para manejar las imágenes del vehículo
// - Vista previa de imágenes
// - Límites
// - Reordenamiento con arrastrar y soltar (drag & drop)

let archivosVehiculo = []; // Almacena los archivos seleccionados
let elementoArrastrado = null; // Guarda temporalmente el elemento que se está arrastrando

export function obtenerArchivosVehiculo() { 
    return archivosVehiculo; 
}

export function reiniciarArchivosVehiculo() {
    archivosVehiculo = [];
    document.getElementById("vehiculo-image-preview-container").innerHTML = "";
}

// 🔹 Reemplaza los archivos actuales por un nuevo conjunto (útil al editar)
export function establecerArchivosVehiculo(archivos) {
    archivosVehiculo = [...archivos]; 
    dibujarVistasPrevias(); 
}

// 🔹 Inicializa el input para cargar imágenes
// Controla el límite de 4 imágenes y genera las vistas previas
export function inicializarInputImagenes(idDelInput) {
    const input = document.getElementById(idDelInput);

    input.addEventListener("change", () => {
        const archivosNuevos = [...input.files];

        // Si supera el límite de 4 imágenes, alerta y cancela
        if (archivosVehiculo.length + archivosNuevos.length > 4) {
            alert("Máximo 4 imágenes permitidas.");
            input.value = "";
            return;
        }

        // Agrega las nuevas imágenes al array principal
        archivosVehiculo.push(...archivosNuevos);
        dibujarVistasPrevias();
        input.value = ""; // Limpia el input para evitar duplicados
    });
}

// 🔹 Dibuja las vistas previas de todas las imágenes cargadas
function dibujarVistasPrevias() {
    const contenedor = document.getElementById("vehiculo-image-preview-container");
    contenedor.innerHTML = ""; // Limpia el contenido previo

    archivosVehiculo.forEach((archivo, indice) => {
        // Crea el HTML de la vista previa
        const vistaPrevia = crearHtmlVistaPrevia(archivo, indice);
        // Asigna los eventos de arrastre y soltar
        asignarEventosArrastre(vistaPrevia);
        // Agrega la vista al contenedor
        contenedor.appendChild(vistaPrevia);
    });
}

// 🔹 Crea el HTML para una imagen con botón de eliminar
function crearHtmlVistaPrevia(archivo, indice) {
    const contenedor = document.createElement("div");
    contenedor.className = "img-preview-wrapper";
    contenedor.dataset.index = indice; // Guarda su posición original
    contenedor.draggable = true; // Habilita arrastre

    // Crea el elemento <img> con su respectiva fuente
    const img = document.createElement("img");
    img.className = "img-preview";
    img.src = archivo instanceof File ? URL.createObjectURL(archivo) : archivo;

    // Botón para eliminar imagen
    const botonBorrar = document.createElement("button");
    botonBorrar.type = "button";
    botonBorrar.className = "remove-img-btn";
    botonBorrar.innerHTML = "&times;"; // Representa una "X"

    // Evento: eliminar imagen del array y redibujar
    botonBorrar.onclick = (e) => {
        e.stopPropagation(); // Evita conflictos con el arrastre
        archivosVehiculo.splice(indice, 1); 
        dibujarVistasPrevias(); 
    };

    // Agrega la imagen y el botón al contenedor
    contenedor.appendChild(img);
    contenedor.appendChild(botonBorrar);

    return contenedor;
}

// 🔹 Asigna los eventos de arrastrar y soltar a cada imagen
function asignarEventosArrastre(item) { 
    // Cuando empieza a arrastrarse
    item.addEventListener("dragstart", () => {
        elementoArrastrado = item;
        item.classList.add("dragging");
    });

    // Cuando termina el arrastre
    item.addEventListener("dragend", () => {
        if (elementoArrastrado) { 
            elementoArrastrado.classList.remove("dragging");
        }
        elementoArrastrado = null; 
        actualizarOrdenArchivos(); // Reorganiza el array según el nuevo orden
    });

    // Mientras se arrastra sobre otro elemento
    item.addEventListener("dragover", (e) => {
        e.preventDefault(); // Permite el arrastre
        if (!elementoArrastrado) return; 

        const contenedor = document.getElementById("vehiculo-image-preview-container");
        const elementoSiguiente = obtenerElementoSiguiente(contenedor, e.clientX);

        // Inserta la imagen arrastrada antes o después del elemento actual
        if (elementoSiguiente == null) {
            contenedor.appendChild(elementoArrastrado);
        } else {
            contenedor.insertBefore(elementoArrastrado, elementoSiguiente);
        }
    });
}

// 🔹 Devuelve el elemento siguiente en función de la posición del mouse (x)
function obtenerElementoSiguiente(container, x) {
    const items = [...container.querySelectorAll(".img-preview-wrapper:not(.dragging)")];
    
    let elementoMasCercano = null;
    let offsetMasCercano = Number.NEGATIVE_INFINITY;

    items.forEach(item => {
        const caja = item.getBoundingClientRect();
        const offset = x - (caja.left + caja.width / 2);

        // Detecta cuál elemento está más cerca del cursor
        if (offset < 0 && offset > offsetMasCercano) {
            offsetMasCercano = offset;
            elementoMasCercano = item;
        }
    });

    return elementoMasCercano; 
}

// 🔹 Actualiza el orden del array de archivos según el orden visual
function actualizarOrdenArchivos() {
    const container = document.getElementById("vehiculo-image-preview-container");

    // Obtiene los índices originales en el nuevo orden visual
    const nuevoOrdenIndices = [...container.querySelectorAll(".img-preview-wrapper")]
        .map(div => parseInt(div.dataset.index));

    // Reconstruye el array con el nuevo orden
    archivosVehiculo = nuevoOrdenIndices.map(i => archivosVehiculo[i]);

    // Redibuja las vistas para actualizar los índices visibles
    dibujarVistasPrevias();
}