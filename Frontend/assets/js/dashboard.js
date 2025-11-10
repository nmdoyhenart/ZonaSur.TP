import { initVehiculoImageUploadInput } from './modules/ui.js';
import { loadUsers, handleUserFormSubmit } from './modules/userHandlers.js';
import { loadVehicles, handleVehiculoFormSubmit, resetVehiculoForm } from './modules/vehicleHandlers.js';
import { loadReservations } from './modules/userHandlers.js';

document.addEventListener('DOMContentLoaded', () => {

    // Tabs
    const usuariosTab = document.getElementById('usuarios-tab');
    const productosTab = document.getElementById('productos-tab');
    const reservasTab = document.getElementById('reservas-tab');

    const addUserForm = document.getElementById('add-user-form');
    const vehiculoForm = document.getElementById('vehiculo-form');

    const cancelEditBtn = document.getElementById('cancelEditVehiculoBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Inicializar input imágenes
    initVehiculoImageUploadInput("vehiculoImageUpload");

    // Tabs listeners
    usuariosTab?.addEventListener("shown.bs.tab", () => loadUsers());
    productosTab?.addEventListener("shown.bs.tab", () => loadVehicles());

    // Form usuarios
    addUserForm?.addEventListener("submit", handleUserFormSubmit);

    // Form vehículos
    vehiculoForm?.addEventListener("submit", handleVehiculoFormSubmit);
    cancelEditBtn?.addEventListener("click", resetVehiculoForm);

    // Logout
    logoutBtn?.addEventListener("click", () => {
        window.location.href = "bienvenida.html";
    });

    if(reservasTab) {
        reservasTab.addEventListener('shown.bs.tab', () => loadReservations());
    }

    // Cargar panel activo al inicio
    if (document.querySelector("#usuarios-panel.active")) loadUsers();
    if (document.querySelector("#productos-panel.active")) loadVehicles();
    if (document.querySelector('#reservas-panel.active')) { loadReservations(); }

    // Mostrar/ocultar campos según tipo
    document.getElementById("vehiculoTipo").addEventListener("change", (e) => {
        const tipo = e.target.value;

        document.querySelector(".tipo-auto").classList.toggle("d-none", tipo !== "auto");
        document.querySelector(".tipo-moto").classList.toggle("d-none", tipo !== "moto");
    });
});