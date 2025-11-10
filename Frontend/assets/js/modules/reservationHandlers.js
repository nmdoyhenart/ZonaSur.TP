export async function loadReservations() {
    const container = document.getElementById('reservas-content');
    if (!container) return;
    container.innerHTML = '<p>Cargando reservas...</p>';
    
    try {
        const response = await fetch('http://localhost:4000/api/reservas');
        if (!response.ok) throw new Error('No se pudieron cargar las reservas.');
        const reservas = await response.json();

        if (reservas.length === 0) {
            container.innerHTML = '<p>No hay reservas registradas.</p>';
            return;
        }

        let tablaHTML = `
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
                    <tbody>
        `;
        
        reservas.forEach(reserva => {
            // Mapeamos los productos de esta reserva a un string simple
            const productosStr = reserva.productos.map(p => `${p.modelo} (x${p.cantidad})`).join(', ');
            
            tablaHTML += `
                <tr>
                    <td>${new Date(reserva.fechaReserva).toLocaleString('es-AR')}</td>
                    <td>${reserva.usuarioNombre}</td>
                    <td>${productosStr}</td>
                    <td>u$s${reserva.totalReserva.toLocaleString('es-AR')}</td>
                </tr>
            `;
        });
        
        tablaHTML += `</tbody></table></div>`;
        container.innerHTML = tablaHTML;

    } catch (error) {
        console.error("Error al cargar reservas:", error);
        container.innerHTML = `<p class="text-danger">${error.message}</p>`;
    }
}