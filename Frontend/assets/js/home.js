const API_BASE_URL = 'http://localhost:4000';

let paginaActual = 1;
let totalPaginasAutos = 1;
let totalPaginasMotos = 1;

const LIMITE_POR_PAGINA = 3;

const stockContainer = document.getElementById('compra');
let filtroActual = 'todos';

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos(true);

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

    // --- FILTRADO ---
    document.getElementById('filtro-todos')?.addEventListener('click', () => filtrarVehiculos('todos'));
    document.getElementById('filtro-autos')?.addEventListener('click', () => filtrarVehiculos('auto'));
    document.getElementById('filtro-motos')?.addEventListener('click', () => filtrarVehiculos('moto'));
});

function filtrarVehiculos(tipo) {
    filtroActual = tipo;
    const todosLosVehiculos = document.querySelectorAll('.vehiculo'); 
    
    todosLosVehiculos.forEach(vehiculo => {
        if (tipo === 'todos' || vehiculo.dataset.tipo === tipo) {
            vehiculo.style.display = 'block';
        } else {
            vehiculo.style.display = 'none';
        }
    });
}

async function cargarProductos(resetear = false) {
    if (resetear) {
        stockContainer.innerHTML = '';
        paginaActual = 1; 
    }

    try {
        const [autosRes, motosRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/autos?page=${paginaActual}&limit=${LIMITE_POR_PAGINA}`).then(r => r.json()),
            fetch(`${API_BASE_URL}/api/motos?page=${paginaActual}&limit=${LIMITE_POR_PAGINA}`).then(r => r.json())
        ]);

        if (paginaActual === 1) {
            totalPaginasAutos = autosRes.totalPages;
            totalPaginasMotos = motosRes.totalPages;
        }

        const productos = [
            ...autosRes.docs.map(a => ({ ...a, tipo: 'auto' })),
            ...motosRes.docs.map(m => ({ ...m, tipo: 'moto' }))
        ];

        if (productos.length === 0 && paginaActual === 1) {
            stockContainer.innerHTML = '<p class="text-center">No hay vehículos disponibles.</p>';
            return;
        }

        renderizarTarjetas(productos); // Renderiza los nuevos productos
        renderizarBoton();
        
        filtrarVehiculos(filtroActual); 
    } catch (error) {
        console.error('Error al obtener los vehículos:', error);
        stockContainer.innerHTML = '<p class="text-center">No se pudo cargar los vehículos.</p>';
    }
}

function renderizarTarjetas(productos) {
    if (productos.length === 0) return; 

    productos.forEach(item => {
        const cardColumn = document.createElement('div');
        cardColumn.className = "col-lg-4 col-md-6 mb-4 vehiculo"; 
        cardColumn.dataset.tipo = item.tipo || '';

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
        stockContainer.appendChild(cardColumn); 
    });
}

function renderizarBoton() {
    const botonExistente = document.getElementById('btn-paginacion-wrapper');
    if (botonExistente) {
        botonExistente.remove();
    }
    
    // Comprueba si hay más páginas por cargar
    const hayMasPaginas = (paginaActual < totalPaginasAutos) || (paginaActual < totalPaginasMotos);

    // Dibuja el wrapper
    const wrapper = document.createElement('div');
    wrapper.id = 'btn-paginacion-wrapper';
    wrapper.className = 'col-12 text-center mt-4';
    
    let buttonHTML = '';

    if (hayMasPaginas) {
        buttonHTML = `
            <button class="btn btn-dark rounded-pill px-5 py-3" id="btn-cargar-mas">
                Cargar Más
            </button>
        `;
    } else if (paginaActual > 1) {
        buttonHTML = `
            <button class="btn btn-outline-dark rounded-pill px-5 py-3" id="btn-ver-menos">
                Ver Menos
            </button>
        `;
    }

    wrapper.innerHTML = buttonHTML;
    stockContainer.appendChild(wrapper);

    const btnCargarMas = document.getElementById('btn-cargar-mas');
    const btnVerMenos = document.getElementById('btn-ver-menos');

    if (btnCargarMas) {
        btnCargarMas.onclick = () => {
            paginaActual++;
            cargarProductos(false);
        };
    }

    if (btnVerMenos) {
        btnVerMenos.onclick = () => {
            cargarProductos(true);
            stockContainer.scrollIntoView({ behavior: 'smooth' });
        };
    }
}