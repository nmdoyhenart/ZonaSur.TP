const API_BASE_URL = 'http://localhost:4000';
const CART_STORAGE_KEY = 'reservaAutos';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const vehiculoId = params.get('id');

    if (!vehiculoId) {
        document.querySelector('main').innerHTML = '<h1 class="text-center my-5">ID de vehículo no proporcionado.</h1>';
        return;
    }

    fetch(`${API_BASE_URL}/api/autos/${vehiculoId}`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => rellenarDatos(data, "auto"))
        .catch(() => {
            fetch(`${API_BASE_URL}/api/motos/${vehiculoId}`)
                .then(res => res.ok ? res.json() : Promise.reject("Vehículo no encontrado"))
                .then(data => rellenarDatos(data, "moto"))
                .catch(error => {
                    console.error("Error al obtener detalle:", error);
                    document.querySelector('main').innerHTML =
                        `<h1 class="text-center my-5">${error}</h1>`;
                });
        });
});

function agregarAlCarrito(vehiculoId, stockDisponible) {
    let carrito = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

    const item = carrito.find(a => a.id === vehiculoId);

    if (item) {
        if (item.cantidad < stockDisponible) {
            item.cantidad++;
        } else {
            alert("Ya agregaste el máximo disponible.");
            return;
        }
    } else {
        carrito.push({ id: vehiculoId, cantidad: 1 });
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
}

function rellenarDatos(vehiculo, tipo) {
    const heroSection = document.getElementById('producto-hero');
    heroSection.style.backgroundImage = `url(${vehiculo.imagenes[0]})`;

    document.getElementById('producto-modelo').textContent = vehiculo.modelo;
    document.getElementById('producto-precio').textContent = `u$s${vehiculo.precio.toLocaleString('es-AR')}`;

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

    const carouselInner = document.getElementById('carousel-inner');
    const carouselIndicators = document.getElementById('carousel-indicators');
    carouselInner.innerHTML = '';
    carouselIndicators.innerHTML = '';

    vehiculo.imagenes.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `<img src="${img}" class="d-block w-100" alt="">`;
        carouselInner.appendChild(item);

        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.dataset.bsTarget = '#producto-galeria';
        indicator.dataset.bsSlideTo = index;
        if (index === 0) indicator.classList.add('active');
        carouselIndicators.appendChild(indicator);
    });

    const reservarBtn = document.getElementById('reservar-btn');
    reservarBtn.addEventListener('click', (e) => {
        e.preventDefault();

        agregarAlCarrito(vehiculo._id, vehiculo.stock);

        alert('¡Agregado al carrito!');
        window.location.href = 'carrito.html';
    });
}