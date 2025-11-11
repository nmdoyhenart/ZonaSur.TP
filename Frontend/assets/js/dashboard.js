import { inicializarInputImagenes } from './modules/manejoVisual.js';
import { cargarUsuarios, manejarSubmitUsuario } from './modules/manejoUsuarios.js';
import { cargarVehiculos, manejarSubmitVehiculo, resetVehiculoForm } from './modules/manejoVehiculos.js';
import { cargarReservas } from './modules/manejoReservas.js';

document.addEventListener('DOMContentLoaded', () => {
    const tabUsuarios = document.getElementById('usuarios-tab');
    const tabVehiculos = document.getElementById('productos-tab');
    const tabReservas = document.getElementById('reservas-tab');

    const formUsuarios = document.getElementById('add-user-form');
    const formVehiculos = document.getElementById('vehiculo-form');

    const btnCancelarEdicionVehiculo = document.getElementById('cancelEditVehiculoBtn');
    const btnLogout = document.getElementById('logoutBtn');

    inicializarInputImagenes("vehiculoImageUpload");

    // Pestaña: Usuarios
    tabUsuarios?.addEventListener("shown.bs.tab", () => {
        cargarUsuarios();
    });

    // Pestaña: Vehículos
    tabVehiculos?.addEventListener("shown.bs.tab", () => {
        cargarVehiculos();
    });

    // Pestaña: Reservas
    tabReservas?.addEventListener("shown.bs.tab", () => {
        cargarReservas();
    });

    // Form de Usuarios
    formUsuarios?.addEventListener("submit", manejarSubmitUsuario);

    // Form de Vehículos
    formVehiculos?.addEventListener("submit", manejarSubmitVehiculo);

    // Botón cancelar edición de vehículo
    btnCancelarEdicionVehiculo?.addEventListener("click", resetVehiculoForm);

    btnLogout?.addEventListener("click", () => {
        window.location.href = "bienvenida.html";
    });


    // Cargar pestaña activa  dashboard
    if (document.querySelector("#usuarios-panel.active")) cargarUsuarios();
    if (document.querySelector("#productos-panel.active")) cargarVehiculos();
    if (document.querySelector("#reservas-panel.active")) cargarReservas();


    // Mostrar/ocultar campos del form segun tipo
    const selectTipo = document.getElementById("vehiculoTipo");

    selectTipo?.addEventListener("change", (e) => {
        const tipo = e.target.value;

        // ─ Autos → mostrar transmisión
        document.querySelector(".tipo-auto")
            .classList.toggle("d-none", tipo !== "auto");

        // ─ Motos → mostrar cilindrada
        document.querySelector(".tipo-moto")
            .classList.toggle("d-none", tipo !== "moto");
    });
});