const API_BASE_URL = 'http://localhost:4000'; 
const CART_STORAGE_KEY = 'reservaAutoId';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const autoId = params.get('id');

    if (!autoId) {
        document.querySelector('main').innerHTML = '<h1 class="text-center my-5">ID de vehículo no proporcionado.</h1>';
        return;
    }

    fetch(`${API_BASE_URL}/api/autos/${autoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Vehículo no encontrado');
            }
            return response.json();
        })
        .then(auto => {
            rellenarDatos(auto);
        })
        .catch(error => {
            console.error("Error al obtener detalle del auto:", error);
            document.querySelector('main').innerHTML = `<h1 class="text-center my-5">${error.message}</h1>`;
        });
});

function rellenarDatos(auto) {
    const heroSection = document.getElementById('producto-hero');
    heroSection.style.backgroundImage = `url(${auto.imagenes[0]})`;

    document.getElementById('producto-modelo').textContent = auto.modelo;
    document.getElementById('producto-precio').textContent = `u$s${auto.precio.toLocaleString('es-AR')}`;

    const specsList = document.getElementById('producto-specs');
    specsList.innerHTML = `
        <li class="list-group-item"><strong>Año/Modelo:</strong> ${auto.anio}</li>
        <li class="list-group-item"><strong>Kilometraje:</strong> ${auto.kilometraje.toLocaleString('es-AR')} km</li>
        <li class="list-group-item"><strong>Transmisión:</strong> ${auto.transmision}</li>
        <li class="list-group-item"><strong>Color:</strong> ${auto.color}</li>
    `;

    const carouselInner = document.getElementById('carousel-inner');
    const carouselIndicators = document.getElementById('carousel-indicators');
    carouselInner.innerHTML = '';
    carouselIndicators.innerHTML = '';

    auto.imagenes.forEach((imagen, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        
        carouselItem.innerHTML = `<img src="${imagen}" class="d-block w-100" alt="Imagen de ${auto.modelo} ${index + 1}">`;
        carouselInner.appendChild(carouselItem);

        // ... (código de los indicadores) ...
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.dataset.bsTarget = '#producto-galeria';
        indicator.dataset.bsSlideTo = index;
        if (index === 0) {
            indicator.className = 'active';
            indicator.setAttribute('aria-current', 'true');
        }
        carouselIndicators.appendChild(indicator);
    });

    const reservarBtn = document.getElementById('reservar-btn');
    reservarBtn.href = 'carrito.html';
    reservarBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        const carritoActual = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
        if (carritoActual.includes(auto._id)) {
            alert('Este vehículo ya está en tu reserva.');
            window.location.href = 'carrito.html';
            return;
        }
        carritoActual.push(auto._id);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carritoActual));
        alert('¡Vehículo añadido a la reserva!');
        window.location.href = 'carrito.html';
    });
}