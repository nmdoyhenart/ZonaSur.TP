const API_BASE_URL = 'http://localhost:4000';
const CART_STORAGE_KEY = 'reservaAutos';

let autosEnCarrito = [];

fixBug();
function fixBug() {
    const viejo = JSON.parse(localStorage.getItem("reservaAutoId"));

    if (!viejo || !Array.isArray(viejo)) return;

    const convertido = viejo.map(id => ({
        id: id,
        cantidad: 1
    }));

    localStorage.setItem("reservaAutos", JSON.stringify(convertido));
    localStorage.removeItem("reservaAutoId");
}

document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const params = new URLSearchParams(window.location.search);

    if (params.get('id')) {
        history.replaceState(null, '', 'carrito.html');
    }

    const carritoGuardado = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

    if (carritoGuardado.length > 0) {
        cargarVehiculosReservados(carritoGuardado, cartContainer);
    } else {
        mostrarCarritoVacio(cartContainer);
    }

    configurarListenersModal();
});

async function cargarVehiculosReservados(carritoGuardado, cartContainer) {
    try {
        const [autosRes, motosRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/autos`),
            fetch(`${API_BASE_URL}/api/motos`)
        ]);

        const autos = await autosRes.json();
        const motos = await motosRes.json();

        const todos = [...autos, ...motos];

        autosEnCarrito = carritoGuardado.map(item => {
            const vehiculo = todos.find(v => v._id === item.id);
            if (vehiculo) {
                vehiculo.cantidad = item.cantidad;
                return vehiculo;
            }
        }).filter(Boolean);

        mostrarTablaCarrito(autosEnCarrito, cartContainer);

    } catch (error) {
        console.error("Error al cargar carrito:", error);
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
        const cantidad = auto.cantidad || 1;
        const precioReservaItem = (auto.precio * 0.10) * cantidad;
        totalReserva += precioReservaItem;
        itemsHTML += `
            <tr data-id="${auto._id}">
                <td><img src="${auto.imagenes[0]}" class="img-fluid rounded" style="max-width: 100px"></td>
                <td>${auto.modelo}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-secondary btn-restar">-</button>
                    <span class="mx-2 cantidad">${cantidad}</span>
                    <button class="btn btn-sm btn-outline-secondary btn-sumar">+</button>
                </td>
                <td class="fw-bold monto-item">
                    u$s${precioReservaItem.toLocaleString('es-AR')}
                </td>
                <td>
                    <button class="btn btn-sm btn-danger btn-eliminar-item" data-id="${auto._id}">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    const cartTableHTML = `
    <div class="card shadow-sm col-md-10 col-lg-10 mx-auto" id="carrito-reserva-card">

        <div class="card-header d-flex justify-content-between align-items-center px-4 py-3">
            <a href="home.html#compra" class="btn btn-sm btn-outline-secondary">
                ← Seguir comprando
            </a>
            <h5 class="mb-0">Tu Reserva (${autos.length} ${autos.length === 1 ? "item" : "items"})</h5>
        </div>

        <div class="card-body p-4 table-responsive">
            <table class="table align-middle">
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Nombre</th>
                        <th class="text-center">Cantidad</th>
                        <th>Monto Reserva (10%)</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>${itemsHTML}</tbody>
            </table>
        </div>

        <div class="card-footer p-4">
            <div class="row align-items-center">
                <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                    <button class="btn btn-danger" id="btn-vaciar-carrito">
                        <i class="bi bi-trash-fill me-2"></i> Vaciar Carrito
                    </button>
                </div>

                <div class="col-md-6 text-center text-md-end">
                    <h5>Total de Reservas:</h5>
                    <h3 class="text-success fw-bold" id="total-reserva-monto">
                        u$s${totalReserva.toLocaleString('es-AR')}
                    </h3>
                    <button class="btn btn-success btn-lg mt-2" id="btn-confirmar-reserva">
                        Confirmar Reserva
                    </button>
                </div>
            </div>
        </div>

        </div>
    `;
    
    cartContainer.innerHTML = cartTableHTML;

    activarControlesCarrito();
}

function activarControlesCarrito() { 
    // --- Confirmar ---
    const btnConfirmar = document.getElementById('btn-confirmar-reserva');
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', prepararTicketYMostrarModal);
    }
    
    // --- Vaciar ---
    const btnVaciar = document.getElementById("btn-vaciar-carrito");
    if (btnVaciar) {
        btnVaciar.addEventListener("click", vaciarCarrito);
    }

    // --- Eliminar ---
    document.querySelectorAll('.btn-eliminar-item').forEach(btn =>
        btn.addEventListener('click', () => eliminarItemDelCarrito(btn.dataset.id))
    );

    // --- Sumar ---
    document.querySelectorAll(".btn-sumar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.closest("tr").dataset.id;
            const auto = autosEnCarrito.find(a => a._id === id);

            if (auto.cantidad >= auto.stock) {
                alert(`Stock máximo disponible: ${auto.stock}`);
                return;
            }

            auto.cantidad++;
            actualizar();
        });
    });

    // --- Restar ---
    document.querySelectorAll(".btn-restar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.closest("tr").dataset.id;
            const auto = autosEnCarrito.find(a => a._id === id);

            if (auto.cantidad > 1) {
                auto.cantidad--;
                actualizar();
            }
        });
    });

    function actualizar() {
        guardarCarrito();
        mostrarTablaCarrito(autosEnCarrito, document.getElementById('cart-container')); 
    }
}

function guardarCarrito() {
    const data = autosEnCarrito.map(auto => ({
        id: auto._id,
        cantidad: auto.cantidad
    }));

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
}

function eliminarItemDelCarrito(id) {
    autosEnCarrito = autosEnCarrito.filter(v => v._id !== id);
    guardarCarrito();

    if (autosEnCarrito.length === 0) {
        mostrarCarritoVacio(document.getElementById('cart-container'));
    } else {
        mostrarTablaCarrito(autosEnCarrito, document.getElementById('cart-container'));
    }
}

function vaciarCarrito() {
    if (confirm("¿Vaciar carrito?")) {
        localStorage.removeItem(CART_STORAGE_KEY);
        autosEnCarrito = [];
        mostrarCarritoVacio(document.getElementById('cart-container'));
    }
}

async function prepararTicketYMostrarModal() {
    if (autosEnCarrito.length === 0) return;

    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Cliente';
    const fechaActual = new Date().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
    let totalTicket = 0;
    let ticketBodyHTML = '';
    
    const productosParaLaApi = autosEnCarrito.map(auto => {
        const precioReservaItem = auto.precio * 0.10 * auto.cantidad;
        totalTicket += precioReservaItem;
        
        ticketBodyHTML += `
            <tr>
                <td>${auto.modelo}</td>
                <td>${auto.cantidad}</td>
                <td>u$s${precioReservaItem.toLocaleString("es-AR")}</td>
            </tr>`;
        
        return {
            _id: auto._id,
            modelo: auto.modelo,
            cantidad: auto.cantidad,
            montoReserva: precioReservaItem
        };
    });

    document.getElementById("ticket-nombre").textContent = nombreUsuario;
    document.getElementById("ticket-fecha").textContent = fechaActual;
    document.getElementById("ticket-tbody").innerHTML = ticketBodyHTML;
    document.getElementById("ticket-total").textContent = `u$s${totalTicket.toLocaleString("es-AR")}`;

    try {
        const response = await fetch(`${API_BASE_URL}/api/reservas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                usuarioNombre: nombreUsuario,
                productos: productosParaLaApi,
                totalReserva: totalTicket
            })
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                alert('Tu sesión ha expirado o no eres válido. Por favor, identifícate de nuevo.');

                window.location.href = 'bienvenida.html'; 
                return; // Detener ejecución
            }

            throw new Error(data.msg || 'Error al guardar la reserva.');
        }

        console.log('Reserva guardada en BD:', data.reserva);
        new bootstrap.Modal(document.getElementById('ticketModal')).show();
        
        localStorage.removeItem(CART_STORAGE_KEY);
        autosEnCarrito = [];

    } catch (error) {
        console.error("Error al confirmar la reserva:", error);
        alert(`Error: ${error.message}`);
    }
}

function configurarListenersModal() {
    const btnCerrarTicket = document.getElementById('btn-cerrar-ticket');
    if (btnCerrarTicket) {
        btnCerrarTicket.addEventListener('click', () => {
            const ticketModal = bootstrap.Modal.getInstance(document.getElementById('ticketModal'));
            if (ticketModal) ticketModal.hide();

            document.getElementById('cart-container').innerHTML = '<h3 class="text-center text-success">¡Gracias por tu reserva!</h3>';
            setTimeout(() => { window.location.href = 'home.html'; }, 1500);
        });
    }
    document.getElementById("btn-descargar-pdf")?.addEventListener("click", generarPDFTicket);
}

async function generarPDFTicket() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const nombre = document.getElementById("ticket-nombre").textContent;
    const fecha = document.getElementById("ticket-fecha").textContent;

    // Logo
    const logoUrl = "../img/zsnavbar.png";
    const img = new Image();
    img.src = logoUrl;

    await new Promise(resolve => img.onload = resolve);

    doc.addImage(img, "PNG", 20, 15, 40, 15);

    // Encabezado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Ticket de Reserva", 105, 35, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${fecha}`, 20, 50);
    doc.text(`Cliente: ${nombre}`, 20, 58);

    // Tabla
    let y = 75;

    doc.setFillColor(230, 230, 230);
    doc.rect(20, y, 170, 10, "F");

    doc.setFont("helvetica", "bold");
    doc.text("Producto", 25, y + 7);
    doc.text("Cantidad", 110, y + 7);
    doc.text("Monto", 155, y + 7);

    y += 12;
    doc.setFont("helvetica", "normal");

    let total = 0;

    autosEnCarrito.forEach(auto => {
        const monto = auto.precio * 0.10 * auto.cantidad;
        total += monto;

        doc.rect(20, y, 170, 10);
        doc.text(auto.modelo, 25, y + 7);
        doc.text(String(auto.cantidad), 120, y + 7);
        doc.text(`u$s${monto.toLocaleString("es-AR")}`, 155, y + 7);

        y += 10;
    });

    y += 5;

    doc.setFont("helvetica", "bold");
    doc.text(`Total a pagar: u$s${total.toLocaleString("es-AR")}`, 20, y + 10);

    doc.save(`ticket_reserva_${nombre}.pdf`);

    cerrarReservaConMensaje();
}

function cerrarReservaConMensaje() {
    localStorage.removeItem(CART_STORAGE_KEY);
    autosEnCarrito = [];

    document.getElementById('cart-container').innerHTML =
        '<h3 class="text-center text-success">¡Gracias por tu reserva!</h3>';

    const ticketModal = bootstrap.Modal.getInstance(document.getElementById('ticketModal'));
    if (ticketModal) ticketModal.hide();

    setTimeout(() => window.location.href = 'home.html', 1500);
}