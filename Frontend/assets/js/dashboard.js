import { inicializarInputImagenes } from './modules/manejoVisual.js';
import { cargarUsuarios, manejarSubmitUsuario } from './modules/manejoUsuarios.js';
import { cargarVehiculos, manejarSubmitVehiculo, resetVehiculoForm } from './modules/manejoVehiculos.js';
import { cargarReservas } from './modules/manejoReservas.js';

document.addEventListener('DOMContentLoaded', () => {

    // ---- REFERENCIAS ----
    const tabUsuarios = document.getElementById('usuarios-tab');
    const tabVehiculos = document.getElementById('productos-tab');
    const tabReservas = document.getElementById('reservas-tab');

    const formUsuarios = document.getElementById('add-user-form');
    const formVehiculos = document.getElementById('vehiculo-form');

    const btnCancelarEdicionVehiculo = document.getElementById('cancelEditVehiculoBtn');
    const btnLogout = document.getElementById('logoutBtn');

    const filtroEstadoVehiculo = document.getElementById("filtroEstadoVehiculo");
    const selectTipo = document.getElementById("vehiculoTipo");

    // ---- INICIALIZACIÓN DE INPUT IMÁGENES ----
    inicializarInputImagenes("vehiculoImageUpload");

    // ---- EVENTOS DE TABS ----
    tabUsuarios?.addEventListener("shown.bs.tab", cargarUsuarios);
    tabVehiculos?.addEventListener("shown.bs.tab", cargarVehiculos);
    tabReservas?.addEventListener("shown.bs.tab", cargarReservas);

    // ---- EVENTOS DE FORMULARIOS ----
    formUsuarios?.addEventListener("submit", manejarSubmitUsuario);
    formVehiculos?.addEventListener("submit", manejarSubmitVehiculo);

    // ---- CANCELAR EDICIÓN ----
    btnCancelarEdicionVehiculo?.addEventListener("click", resetVehiculoForm);

    // ---- LOGOUT ----
    btnLogout?.addEventListener("click", () => {
        window.location.href = "bienvenida.html";
    });

    // ---- FILTRO DE ESTADO DE VEHÍCULOS ----
    filtroEstadoVehiculo?.addEventListener("change", cargarVehiculos);

    // ---- CARGAR TAB ACTIVA ----
    if (document.querySelector("#usuarios-panel.active")) cargarUsuarios();
    if (document.querySelector("#productos-panel.active")) cargarVehiculos();
    if (document.querySelector("#reservas-panel.active")) cargarReservas();

    // ---- MOSTRAR/OCULTAR CAMPOS SEGÚN TIPO DE VEHÍCULO ----
    selectTipo?.addEventListener("change", (e) => {
        const tipo = e.target.value;

        document.querySelector(".tipo-auto").classList.toggle("d-none", tipo !== "auto");
        document.querySelector(".tipo-moto").classList.toggle("d-none", tipo !== "moto");
    });
});