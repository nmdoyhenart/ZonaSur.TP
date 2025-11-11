// Obtener reservas desde el backend
// Renderizar tabla en el dashboard
// Mostrar mensaje si no hay reservas

export async function cargarReservas(orden = "desc") {
    const container = document.getElementById('reservas-content');
    if (!container) return;

    container.innerHTML = '<p>Cargando reservas...</p>';

    try {
        const response = await fetch('http://localhost:4000/api/reservas');

        if (!response.ok) {
            throw new Error("No se pudieron cargar las reservas.");
        }

        let reservas = await response.json();

        reservas.sort((a, b) => {
            const fechaA = new Date(a.fechaReserva);
            const fechaB = new Date(b.fechaReserva);

            return orden === "asc" ? fechaA - fechaB : fechaB - fechaA;
        });

        if (reservas.length === 0) {
            container.innerHTML = '<p>No hay reservas registradas.</p>';
            return;
        }

        let tablaHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="dropdown">
                    <button class="btn btn-outline-dark dropdown-toggle" 
                            type="button" 
                            id="filtroReservasBtn" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false">
                        <i class="bi bi-filter"></i> Ordenar
                    </button>

                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="filtroReservasBtn">
                        <li><a class="dropdown-item filtro-reserva" data-order="desc">Más recientes</a></li>
                        <li><a class="dropdown-item filtro-reserva" data-order="asc">Más antiguas</a></li>
                    </ul>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Productos</th>
                            <th>Total Reserva</th>
                        </tr>
                    </thead>
                    <tbody id="reservas-tbody">
        `;

        reservas.forEach(reserva => {
            const productosStr = reserva.productos
                .map(p => `${p.modelo} (x${p.cantidad})`)
                .join(', ');

            tablaHTML += `
                <tr>
                    <td>${new Date(reserva.fechaReserva).toLocaleString('es-AR')}</td>
                    <td>${reserva.usuarioNombre}</td>
                    <td>${productosStr}</td>
                    <td>u$s${reserva.totalReserva.toLocaleString('es-AR')}</td>
                </tr>
            `;
        });

        tablaHTML += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = tablaHTML;

        document.querySelectorAll(".filtro-reserva").forEach(btn => {
            btn.addEventListener("click", () => {
                const nuevoOrden = btn.dataset.order;
                cargarReservas(nuevoOrden);
            });
        });

    } catch (error) {
        console.error("Error al cargar reservas:", error);
        container.innerHTML = `<p class="text-danger">${error.message}</p>`;
    }
}