document.addEventListener('DOMContentLoaded', () => {
    const url = 'data/datos.json';

    fetch(url)
        .then(response => {
            // Verificamos la respuesta de la red
            if (!response.ok) {
                throw new Error('Hubo un problema al cargar los datos.');
            }
            return response.json();
        })
        .then(data => {
            mostrarAutos(data.autos);
        })
        .catch(error => {
            console.error('Error en la operación de fetch:', error);
        });
    
    const slideInElement = document.querySelector('.animate-slide-in');
    const fadeInElement = document.querySelector('.animate-fade-in');

    // Creo un observador
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si el elemento es visible en la pantalla
            if (entry.isIntersecting) {
                // agregamos la clase para activar la animación
                entry.target.classList.add('is-visible');
                // Dejamos de observar este elemento para que la animación no se repita
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3 // La animación se activa cuando al menos el 30% del elemento es visible
    });

    if (slideInElement) {
        observer.observe(slideInElement);
    }
    if (fadeInElement) {
        observer.observe(fadeInElement);
    }
});

//Función para renderizar las tarjetas de los autos en el DOM.
function mostrarAutos(autos) {
    const stockContainer = document.getElementById('compra');
    stockContainer.innerHTML = '';

    const autosPorDefecto = 6;
    let autosVisibles = autosPorDefecto;

    // Función para renderizar un subconjunto de autos
    function renderizarAutos(cantidad) {
        stockContainer.innerHTML = '';
        autos.slice(0, cantidad).forEach(auto => {
            const cardColumn = document.createElement('div');
            cardColumn.className = 'col-lg-4 col-md-6 mb-4';

            cardColumn.innerHTML = `
                <div class="card card-producto">
                    <div class="card-img-wrapper">
                        <img src="${auto.imagen}" class="card-img-top" alt="Imagen de ${auto.modelo}">
                        <div class="card-details-overlay">
                            <ul>
                                <li>Año/Modelo: ${auto.año}</li>
                                <li>Kilometros: ${auto.kilometraje.toLocaleString('es-AR')}</li>
                                <li>Transmisión: ${auto.transmision}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${auto.modelo}</h5>
                    </div>
                    <a href="producto.html?id=${auto.id}" class="stretched-link"></a>
                </div>
            `;
            stockContainer.appendChild(cardColumn);
        });

        // Verificamos si hay más autos para mostrar y si necesitamos el botón
        if (cantidad < autos.length) {
            // Creamos el contenedor para el botón
            const buttonWrapper = document.createElement('div');
            buttonWrapper.className = 'col-12 text-center mt-4'; // Centra el botón

            // Creamos el botón
            const verMasBtn = document.createElement('button');
            verMasBtn.id = 'verMasBtn';
            verMasBtn.className = 'btn btn-dark rounded-pill px-5 py-3'; // Estilo Bootstrap
            verMasBtn.textContent = 'Ver Stock completo';

            // Añadimos el evento clic al botón
            verMasBtn.addEventListener('click', () => {
                autosVisibles = autos.length; // Cambiamos para mostrar todos los autos
                renderizarAutos(autosVisibles); // Volvemos a renderizar
            });

            buttonWrapper.appendChild(verMasBtn);
            stockContainer.appendChild(buttonWrapper);
        }
    }

    // Llamamos a la función por primera vez para mostrar los 6 autos iniciales
    renderizarAutos(autosVisibles);
}