document.addEventListener('DOMContentLoaded', () => {
    alert("¡Estás a un paso de reservar tu próximo vehículo!\nEl vehículo seleccionado se seña con un 10% del valor total.");

    window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
    });

    const params = new URLSearchParams(window.location.search);
    const autoId = params.get('id');
    const cartContainer = document.getElementById('cart-container');

    if (!autoId) {
        cartContainer.innerHTML = '<p class="text-center">No has seleccionado ningún vehículo para reservar.</p>';
        return;
    }

    fetch('http://localhost:4000/api/autos')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la lista de vehículos.');
            }
            return response.json();
        })
        .then(data => {
            console.log('ID buscado desde URL:', autoId);
            console.log('Datos recibidos de la API:', data);
            
            const auto = data.find(a => a._id === autoId);

            console.log('Resultado de find():', auto);

            if (auto) {
                mostrarAutoEnCarrito(auto);
            } else {
                cartContainer.innerHTML = '<p class="text-center">El vehículo seleccionado no fue encontrado.</p>';
            }
        })
        .catch(error => {
            console.error("Error al cargar el carrito:", error);
            cartContainer.innerHTML = '<p class="text-center">Error al cargar la información del vehículo.</p>';
        });
});

function mostrarAutoEnCarrito(auto) {
    const cartContainer = document.getElementById('cart-container');
    const precioReserva = auto.precio * 0.10;

    const cartItemHTML = `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${auto.imagenes[0]}" class="img-fluid rounded-start" alt="${auto.modelo}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title"><strong>${auto.modelo}</strong></h5>
                        <p class="card-text">Año/modelo: ${auto.año}</p>
                        <p class="card-text">Kilometraje: ${auto.kilometraje.toLocaleString('es-AR')}km</p>
                        <p class="card-text">Transmisión: ${auto.transmision}</p>
                        <p class="card-text">Color: ${auto.color}</p>
                        <h4 class="card-text text-end"><strong>Monto de Reserva (10%): u$s${precioReserva.toLocaleString('es-AR')}</strong></h4>
                        <div class="d-flex justify-content-end mt-3">
                            <button class="btn btn-success">Confirmar Reserva</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    cartContainer.innerHTML = cartItemHTML;
}