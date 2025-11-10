const API_BASE_URL = 'http://localhost:4000';

document.addEventListener('DOMContentLoaded', () => {
    const stockContainer = document.getElementById('compra');
    const autosPorDefecto = 6;

    Promise.all([
        fetch(`${API_BASE_URL}/api/autos`).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/motos`).then(r => r.json())
    ])
    .then(([autos, motos]) => {
        const productos = [
            ...autos.map(a => ({ ...a, tipo: 'auto' })),
            ...motos.map(m => ({ ...m, tipo: 'moto' }))
        ];
        actualizarVista(productos, stockContainer, autosPorDefecto, true);
    })
    .catch(error => {
        console.error('Error al obtener los vehículos:', error);
        stockContainer.innerHTML = '<p class="text-center">No se pudo cargar los vehículos.</p>';
    });

    const slideInElement = document.querySelector('.animate-slide-in');
    const fadeInElement = document.querySelector('.animate-fade-in');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    if (slideInElement) observer.observe(slideInElement);
    if (fadeInElement) observer.observe(fadeInElement);
});

function actualizarVista(productos, contenedor, cantidadAMostrar, mostrarMas) {
    renderizarTarjetas(productos, contenedor, cantidadAMostrar);
    renderizarBoton(productos, contenedor, cantidadAMostrar, mostrarMas);
}

function renderizarTarjetas(productos, contenedor, cantidad) {
    contenedor.innerHTML = '';
    const itemsAMostrar = productos.slice(0, cantidad);

    itemsAMostrar.forEach(item => {
        const cardColumn = document.createElement('div');
        cardColumn.className = "col-lg-4 col-md-6 mb-4";

        let rutaImagen = item.imagenes[0];
        
        if (rutaImagen.startsWith('../')) {
            rutaImagen = rutaImagen.replace('../', '/');
        }
        
        const urlCompleta = `${API_BASE_URL}${rutaImagen}`;

        cardColumn.innerHTML = `
            <div class="producto-box">
                <div class="producto-img">
                    <img src="${urlCompleta}" alt="${item.modelo}">
                </div>
                <div class="producto-nombre">
                    ${item.modelo}
                </div>
                <a href="producto.html?id=${item._id}&tipo=${item.tipo}" class="stretched-link"></a>
            </div>
        `;
        contenedor.appendChild(cardColumn);
    });
}

function renderizarBoton(items, contenedor, cantidadActual, mostrarMas) {
    const autosPorDefecto = 6;
    if (items.length <= autosPorDefecto) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'col-12 text-center mt-4';

    const button = document.createElement('button');

    if (mostrarMas) {
        button.className = 'btn btn-dark rounded-pill px-5 py-3';
        button.textContent = 'Ver Stock';
        button.onclick = () => actualizarVista(items, contenedor, items.length, false);
    } else {
        button.className = 'btn btn-outline-dark rounded-pill px-5 py-3';
        button.textContent = 'Ver Menos';
        button.onclick = () => {
            actualizarVista(items, contenedor, autosPorDefecto, true);
            contenedor.scrollIntoView({ behavior: 'smooth' });
        };
    }

    wrapper.appendChild(button);
    contenedor.appendChild(wrapper);
}