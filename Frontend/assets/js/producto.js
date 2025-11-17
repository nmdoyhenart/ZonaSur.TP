const API_BASE_URL = 'http://localhost:4000';
const CART_STORAGE_KEY = 'reservaAutos';

document.addEventListener('DOMContentLoaded', () => {
    // Obtiene el parámetro 'id' de la URL para saber qué vehículo mostrar
    const params = new URLSearchParams(window.location.search);
    const vehiculoId = params.get('id');

    // Si no hay ID, muestra mensaje de error en main y termina
    if (!vehiculoId) {
        document.querySelector('main').innerHTML =
            '<h1 class="text-center my-5">ID de vehículo no proporcionado.</h1>';
        return;
    }

    // Intenta obtener el vehículo como auto primero
    fetch(`${API_BASE_URL}/api/autos/${vehiculoId}`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => rellenarDatos(data, "auto")) // si lo encuentra, rellena datos
        .catch(() => {
            // Si no es auto, intenta como moto
            fetch(`${API_BASE_URL}/api/motos/${vehiculoId}`)
                .then(res => res.ok ? res.json() : Promise.reject("Vehículo no encontrado"))
                .then(data => rellenarDatos(data, "moto")) // si lo encuentra, rellena datos
                .catch(error => {
                    document.querySelector('main').innerHTML =
                        `<h1 class="text-center my-5">${error}</h1>`;
                });
        });
});

function agregarAlCarrito(vehiculoId, stockDisponible) {
    let carrito = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    const item = carrito.find(a => a.id === vehiculoId);

    if (item) {
        // Incrementa cantidad hasta el stock máximo
        if (item.cantidad < stockDisponible) {
            item.cantidad++;
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Stock máximo alcanzado',
                text: 'No puedes agregar más unidades de este vehículo.',
                confirmButtonText: 'Entendido',
                background: document.body.classList.contains('dark-mode') ? '#2e2e2e' : '#fff',
                color: document.body.classList.contains('dark-mode') ? '#f1f1f1' : '#333'
            });
            return;
        }
    } else {
        // Si no existía, lo agrega con cantidad 1
        carrito.push({ id: vehiculoId, cantidad: 1 });
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
}

function rellenarDatos(vehiculo, tipo) {
    // Imagen de portada
    document.getElementById('producto-hero').style.backgroundImage = `url(${vehiculo.imagenes[0]})`;
    // Modelo y precio
    document.getElementById('producto-modelo').textContent = vehiculo.modelo;
    document.getElementById('producto-precio').textContent =
        `u$s${vehiculo.precio.toLocaleString('es-AR')}`;

    // Lista de especificaciones
    const specsList = document.getElementById('producto-specs');
    specsList.innerHTML = `
        <li class="list-group-item"><strong>Año/Modelo:</strong> ${vehiculo.anio}</li>
        <li class="list-group-item"><strong>Kilometraje:</strong> ${vehiculo.kilometraje.toLocaleString('es-AR')} km</li>
        ${
            tipo === "auto"
            ? `<li class="list-group-item"><strong>Transmisión:</strong> ${vehiculo.transmision}</li>`
            : `<li class="list-group-item"><strong>Cilindrada:</strong> ${vehiculo.cilindrada} cc</li>`
        }
        <li class="list-group-item"><strong>Color:</strong> ${vehiculo.color}</li>
    `;

    // Config carrusel de imágenes
    const carouselInner = document.getElementById('carousel-inner');
    const carouselIndicators = document.getElementById('carousel-indicators');
    carouselInner.innerHTML = '';
    carouselIndicators.innerHTML = '';

    vehiculo.imagenes.forEach((img, index) => {
        // Slide del carrusel
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `<img src="${img}" class="d-block w-100" alt="">`;
        carouselInner.appendChild(item);

        // Indicadores del carrusel
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.dataset.bsTarget = '#producto-galeria';
        indicator.dataset.bsSlideTo = index;
        if (index === 0) indicator.classList.add('active');
        carouselIndicators.appendChild(indicator);
    });

    // Configura botón de reservar
    const reservarBtn = document.getElementById('reservar-btn');
    reservarBtn.addEventListener('click', (e) => {
        e.preventDefault();

        agregarAlCarrito(vehiculo._id, vehiculo.stock); // agrega al carrito

        // Muestra alerta de éxito y redirige al carrito
        Swal.fire({
            icon: 'success',
            title: 'Agregado al carrito',
            text: 'El vehículo fue añadido correctamente.',
            confirmButtonText: 'Ir al carrito',
            background: document.body.classList.contains('dark-mode') ? '#2e2e2e' : '#fff',
            color: document.body.classList.contains('dark-mode') ? '#f1f1f1' : '#333'
        }).then(() => {
            window.location.href = 'carrito.html';
        });
    });
}