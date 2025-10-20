document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener el ID del auto de la URL
    const params = new URLSearchParams(window.location.search);
    const autoId = parseInt(params.get('id'));

    // 2. Cargar los datos de todos los autos
    fetch('../data/datos.json')
        .then(response => response.json())
        .then(data => {
            // 3. Encontrar el auto específico usando el ID
            const auto = data.autos.find(a => a.id === autoId);

            if (auto) {
                // 4. Si encontramos el auto, rellenamos la página
                rellenarDatos(auto);
            } else {
                // Manejo de error si no se encuentra el auto
                document.querySelector('main').innerHTML = '<h1 class="text-center my-5">Vehículo no encontrado</h1>';
            }
        });
});

function rellenarDatos(auto) {
    // Rellenar la sección Hero con la primera imagen
    const heroSection = document.getElementById('producto-hero');
    heroSection.style.backgroundImage = `url(${auto.imagenes[0]})`;

    // Rellenar Modelo y Precio
    document.getElementById('producto-modelo').textContent = auto.modelo;
    document.getElementById('producto-precio').textContent = `u$s${auto.precio.toLocaleString('es-AR')}`;

    // Rellenar lista de especificaciones
    const specsList = document.getElementById('producto-specs');
    specsList.innerHTML = `
        <li class="list-group-item"><strong>Año/Modelo:</strong> ${auto.año}</li>
        <li class="list-group-item"><strong>Combustible:</strong> ${auto.combustible}</li>
        <li class="list-group-item"><strong>Kms:</strong> ${auto.kms.toLocaleString('es-AR')}</li>
        <li class="list-group-item"><strong>Motorización:</strong> ${auto.motorizacion}</li>
        <li class="list-group-item"><strong>Transmisión:</strong> ${auto.transmision}</li>
        <li class="list-group-item"><strong>Color:</strong> ${auto.color}</li>
    `;

    // Rellenar la galería (Carrusel de Bootstrap)
    const carouselInner = document.getElementById('carousel-inner');
    const carouselIndicators = document.getElementById('carousel-indicators');
    auto.imagenes.forEach((imagen, index) => {
        // Crear el item de la imagen
        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        carouselItem.innerHTML = `<img src="${imagen}" class="d-block w-100" alt="Imagen de ${auto.modelo} ${index + 1}">`;
        carouselInner.appendChild(carouselItem);

        // Crear el indicador (el puntito de abajo)
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
}