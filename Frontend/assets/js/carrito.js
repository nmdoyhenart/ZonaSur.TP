const API_BASE_URL = 'http://localhost:4000';
const CART_STORAGE_KEY = 'reservaAutoId';
let autosEnCarrito = [];

document.addEventListener('DOMContentLoaded', () => {
    
    window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
    });

    const cartContainer = document.getElementById('cart-container');
    const params = new URLSearchParams(window.location.search);
    const idDesdeURL = params.get('id');

    if (idDesdeURL) {
        history.replaceState(null, '', 'carrito.html'); 
    }

    const idsReservados = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

    if (idsReservados.length > 0) {
        cargarAutosReservados(idsReservados, cartContainer);
    } else {
        mostrarCarritoVacio(cartContainer);
    }

    configurarListenersModal();
});

async function cargarAutosReservados(ids, cartContainer) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/autos`);
        if (!response.ok) throw new Error('Error al cargar vehículos.');
        const todosLosAutos = await response.json();

        autosEnCarrito = todosLosAutos.filter(auto => ids.includes(auto._id));
        
        mostrarTablaCarrito(autosEnCarrito, cartContainer);

    } catch (error) {
        console.error("Error al cargar el carrito:", error);
        cartContainer.innerHTML = `<p class="text-center text-danger">${error.message}</p>`;
    }
}

function mostrarCarritoVacio(cartContainer) {
    cartContainer.innerHTML = `
        <div class="text-center">
            <h3 class="text-muted mb-4">Tu carrito de reserva está vacío.</h3>
            <a href="home.html#compra" class="btn btn-primary btn-lg">
                <i class="bi bi-car-front-fill me-2"></i>Ver Vehículos
            </a>
        </div>
    `;
}

function mostrarTablaCarrito(autos, cartContainer) {
    let totalReserva = 0;
    let itemsHTML = '';

    autos.forEach(auto => {
        const precioReservaItem = auto.precio * 0.10;
        totalReserva += precioReservaItem;
        
        itemsHTML += `
            <tr>
                <td>
                    <img src="${auto.imagenes[0]}" alt="${auto.modelo}" style="width: 100px; height: auto; border-radius: 4px;">
                </td>
                <td class="align-middle">${auto.modelo}</td>
                <td class="align-middle">1</td> <td class="align-middle">u$s${precioReservaItem.toLocaleString('es-AR')}</td>
                <td class="align-middle">
                    <button class="btn btn-sm btn-danger btn-eliminar-item" data-id="${auto._id}" title="Eliminar item">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    const cartTableHTML = `
        <div class="card col-md-10 col-lg-10 mx-auto" id="carrito-reserva-card">
            <div class="card-header d-flex justify-content-between align-items-center px-4 py-3">
                <a href="home.html#compra" class="btn btn-sm btn-outline-light"><i class="bi bi-arrow-left me-2"></i>Seguir comprando</a>
                <h5 class="mb-0">Tu Reserva (${autos.length} ${autos.length === 1 ? 'item' : 'items'})</h5>
            </div>
            
            <div class="card-body p-4 table-responsive">
                <table class="table align-middle text-white" style="background-color: #212529;">
                    <thead>
                        <tr>
                            <th>Foto</th>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Monto Reserva (10%)</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>
            </div>

            <div class="card-footer p-4">
                <div class="row align-items-center">
                    <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        <button class="btn btn-danger" id="btn-vaciar-carrito">
                            <i class="bi bi-trash-fill me-2"></i>Vaciar Carrito
                        </button>
                    </div>
                    <div class="col-md-6 text-center text-md-end">
                        <h5 class="mb-1">Total de Reservas:</h5>
                        <h3 class="text-success fw-bold">u$s${totalReserva.toLocaleString('es-AR')}</h3>
                        <button class="btn btn-success btn-lg mt-2" id="btn-confirmar-reserva">
                            Confirmar Reserva
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    cartContainer.innerHTML = cartTableHTML;

    document.getElementById('btn-confirmar-reserva').addEventListener('click', prepararTicketYMostrarModal);
    document.getElementById('btn-vaciar-carrito').addEventListener('click', vaciarCarrito);
    document.querySelectorAll('.btn-eliminar-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            eliminarItemDelCarrito(e.currentTarget.dataset.id);
        });
    });
}

function prepararTicketYMostrarModal() {
    if (autosEnCarrito.length === 0) return;

    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Cliente';
    const fechaActual = new Date().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
    let totalTicket = 0;
    let ticketBodyHTML = '';

    autosEnCarrito.forEach(auto => {
        const precioReservaItem = auto.precio * 0.10;
        totalTicket += precioReservaItem;
        ticketBodyHTML += `
            <tr>
                <td>${auto.modelo}</td>
                <td>1</td>
                <td>u$s${precioReservaItem.toLocaleString('es-AR')}</td>
            </tr>
        `;
    });

    document.getElementById('ticket-nombre').textContent = nombreUsuario;
    document.getElementById('ticket-fecha').textContent = fechaActual;
    document.getElementById('ticket-tbody').innerHTML = ticketBodyHTML;
    document.getElementById('ticket-total').textContent = `u$s${totalTicket.toLocaleString('es-AR')}`;

    const ticketModal = new bootstrap.Modal(document.getElementById('ticketModal'));
    ticketModal.show();
}

function configurarListenersModal() {
    const btnCerrarTicket = document.getElementById('btn-cerrar-ticket');
    if (btnCerrarTicket) {
        btnCerrarTicket.addEventListener('click', () => {
            localStorage.removeItem(CART_STORAGE_KEY);
            document.getElementById('cart-container').innerHTML = '<h3 class="text-center text-success">¡Gracias por tu reserva!</h3>';
            
            const ticketModal = bootstrap.Modal.getInstance(document.getElementById('ticketModal'));
            if (ticketModal) ticketModal.hide();

            setTimeout(() => { window.location.href = 'home.html'; }, 1500);
        });
    }
    
    const btnDescargar = document.getElementById('btn-descargar-pdf');
    if(btnDescargar) {
        btnDescargar.addEventListener('click', () => {
            alert('La función "Descargar PDF" se implementará en una futura actualización.');
        });
    }
}

function vaciarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar tu carrito de reservas?')) {
        localStorage.removeItem(CART_STORAGE_KEY);
        autosEnCarrito = []; // Limpia la variable global
        mostrarCarritoVacio(document.getElementById('cart-container'));
    }
}

function eliminarItemDelCarrito(autoId) {
    let idsReservados = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    idsReservados = idsReservados.filter(id => id !== autoId);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(idsReservados));
    
    // Recarga la vista del carrito
    if (idsReservados.length === 0) {
        mostrarCarritoVacio(document.getElementById('cart-container'));
    } else {
        cargarAutosReservados(idsReservados, document.getElementById('cart-container'));
    }
}