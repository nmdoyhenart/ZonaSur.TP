document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const autoId = params.get('id');

    console.log('ID de la URL (string):', autoId);

    fetch('http://localhost:4000/api/autos')
        .then(response => response.json())
        .then(data => {
            console.log('Autos recibidos:', data);

            const auto = data.find(a => a._id === autoId);

            console.log('Auto encontrado:', auto);

            if (auto) {
                rellenarDatos(auto);
            } else {
                document.querySelector('main').innerHTML = '<h1 class="text-center my-5">Vehículo no encontrado</h1>';
            }
        })
        .catch(error => {
            console.error("Error al obtener detalle del auto:", error);
            document.querySelector('main').innerHTML = '<h1 class="text-center my-5">Error al cargar el vehículo</h1>';
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
            <li class="list-group-item"><strong>Kilometraje:</strong> ${auto.kilometraje.toLocaleString('es-AR')}km</li>
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
        document.getElementById('reservar-btn').href = `reserva.html?id=${auto._id}`;
}