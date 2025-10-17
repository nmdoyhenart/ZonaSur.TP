// Esperamos a que todo el contenido del HTML se haya cargado antes de ejecutar el script.
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
});

//Función para renderizar las tarjetas de los autos en el DOM.
function mostrarAutos(autos) {
    const stockContainer = document.getElementById('compra');
    
    stockContainer.innerHTML = '';

    // Recorremos el array de autos para crear una tarjeta para cada uno
    autos.forEach(auto => {
        const cardColumn = document.createElement('div');
        cardColumn.className = 'col-lg-4 col-md-6 mb-4';

        cardColumn.innerHTML = `
            <div class="card card-producto text-white align text-center">
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
}