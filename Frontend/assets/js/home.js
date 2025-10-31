document.addEventListener('DOMContentLoaded', () => {
    const url = 'http://localhost:4000/api/autos';
    const stockContainer = document.getElementById('compra');
    const autosPorDefecto = 6;
    let todosLosAutos = [];

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Respuesta de red no fue ok al obtener autos');
            }
            return response.json(); 
        })
        .then(data => {

            todosLosAutos = data;
            actualizarVista(todosLosAutos, stockContainer, autosPorDefecto, true);
        })
        .catch(error => {
            console.error('Error al obtener los autos desde la API:', error);
            stockContainer.innerHTML = '<p class="text-center">No se pudo cargar los vehículos.</p>';
        });
    
    const slideInElement = document.querySelector('.animate-slide-in');
    const fadeInElement = document.querySelector('.animate-fade-in');

    // Creo un observador
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si el elemento es visible
            if (entry.isIntersecting) {
                // Agrega clase para activar la animación
                entry.target.classList.add('is-visible');
                // Deja de observar para no repetir la animación
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3 // Se activa cuando al menos el 30% del elemento es visible
    });

    if (slideInElement) {
        observer.observe(slideInElement);
    }
    if (fadeInElement) {
        observer.observe(fadeInElement);
    }
});

function actualizarVista(autos, contenedor, cantidadAMostrar, mostrarMas) {
    renderizarTarjetas(autos, contenedor, cantidadAMostrar);
    renderizarBoton(autos, contenedor, cantidadAMostrar, mostrarMas);
}

function renderizarTarjetas(autos, contenedor, cantidad) {
    contenedor.innerHTML = '';
    const autosAMostrar = autos.slice(0, cantidad);

    autosAMostrar.forEach(auto => {
        console.log('Inspeccionando auto:', auto);

        const cardColumn = document.createElement('div');
        cardColumn.className = 'col-lg-4 col-md-6 mb-4';
        cardColumn.innerHTML = `
        <div class="card card-producto">
            <div class="card-img-wrapper">
                <img src="${auto.imagenes[0]}" class="card-img-top" alt="Imagen de ${auto.modelo}">
                <div class="card-details-overlay">
                    <ul>
                        <li>Año/Modelo: ${auto.anio}</li>
                        <li>Kilometraje: ${auto.kilometraje.toLocaleString('es-AR')} km</li>
                        <li>Transmisión: ${auto.transmision}</li>
                    </ul>
                </div>
            </div>
            <div class="card-body">
                <h5 class="card-title text-center">${auto.modelo}</h5>
            </div>
            <a href="producto.html?id=${auto._id}" class="stretched-link"></a>
        </div>
        `;
        contenedor.appendChild(cardColumn);
    });
}

function renderizarBoton(autos, contenedor, cantidadActual, mostrarMas) {
    const autosPorDefecto = 6;
    if (autos.length <= autosPorDefecto) return; // Si no hay suficientes autos, no hacemos nada

    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'col-12 text-center mt-4';
    const button = document.createElement('button');

    if (mostrarMas) {
        button.className = 'btn btn-dark rounded-pill px-5 py-3';
        button.textContent = 'Ver Stock';
        button.onclick = () => actualizarVista(autos, contenedor, autos.length, false);
    } else {
        button.className = 'btn btn-outline-dark rounded-pill px-5 py-3';
        button.textContent = 'Ver Menos';
        button.onclick = () => {
            actualizarVista(autos, contenedor, autosPorDefecto, true);
            contenedor.scrollIntoView({ behavior: 'smooth' });
        };
    }

    buttonWrapper.appendChild(button);
    contenedor.appendChild(buttonWrapper);
}