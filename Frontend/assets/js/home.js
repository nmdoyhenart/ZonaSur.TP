document.addEventListener('DOMContentLoaded', () => {
    const stockContainer = document.getElementById('compra');
    const autosPorDefecto = 6;

    window.productosAll = [];

    Promise.all([
        fetch('http://localhost:4000/api/autos').then(r => r.json()),
        fetch('http://localhost:4000/api/motos').then(r => r.json())
    ])
    .then(([autos, motos]) => {
        window.productosAll = [
            ...autos.map(a => ({ ...a, tipo: 'auto' })),
            ...motos.map(m => ({ ...m, tipo: 'moto' }))
        ].filter(producto => producto.activo === true);

        actualizarVista(window.productosAll, stockContainer, autosPorDefecto, true);
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

function filtrarVehiculosPorTipoEnMemoria(tipo) {
    if (!window.productosAll || window.productosAll.length === 0) return [];
    if (tipo === 'todos') return window.productosAll;
    return window.productosAll.filter(p => p.tipo === tipo);
}

window.filtrarVehiculos = function(tipo) {
    const stockContainer = document.getElementById('compra');
    const autosPorDefecto = 6;
    const productosFiltrados = filtrarVehiculosPorTipoEnMemoria(tipo);
    actualizarVista(productosFiltrados, stockContainer, autosPorDefecto, true);
};

function actualizarVista(productos, contenedor, cantidadAMostrar, mostrarMas) {
    renderizarTarjetas(productos, contenedor, cantidadAMostrar);
    renderizarBoton(productos, contenedor, cantidadAMostrar, mostrarMas);
}

function renderizarTarjetas(productos, contenedor, cantidad) {
    contenedor.innerHTML = '';
    const itemsAMostrar = productos.slice(0, cantidad);

    itemsAMostrar.forEach(item => {
        const cardColumn = document.createElement('div');
        cardColumn.className = "col-lg-4 col-md-6 mb-4 vehiculo";
        cardColumn.dataset.tipo = item.tipo || '';

        cardColumn.innerHTML = `
            <div class="producto-box card bg-dark text-white h-100">
                <div class="producto-img">
                    <img src="${item.imagenes && item.imagenes.length ? item.imagenes[0] : '../img/placeholder.png'}" alt="${item.modelo}" class="card-img-top">
                </div>
                <div class="card-body text-center producto-nombre">
                    <h5 class="card-title mb-0">${item.modelo || ''}</h5>
                </div>
                <a href="producto.html?id=${item._id || ''}&tipo=${item.tipo || ''}" class="stretched-link"></a>
            </div>
        `;

        contenedor.appendChild(cardColumn);
    });
}

function renderizarBoton(items, contenedor, cantidadActual, mostrarMas) {
    const autosPorDefecto = 6;
    // removemos cualquier wrapper anterior del botón
    const existing = contenedor.querySelector('.ver-stock-wrapper');
    if (existing) existing.remove();

    if (items.length <= autosPorDefecto) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'col-12 text-center mt-4 ver-stock-wrapper';

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