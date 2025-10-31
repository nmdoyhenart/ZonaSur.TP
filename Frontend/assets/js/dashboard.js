// Importamos los manejadores de eventos y UI
import { initImageUploadInput, resetAutoFiles } from './modules/ui.js';
import { loadUsers, handleUserFormSubmit } from './modules/userHandlers.js';
import { loadProducts, handleAutoFormSubmit, resetAutoForm } from './modules/productHandlers.js';

// Funciones para pestañas aún no implementadas
function loadReservations() { console.log('Llamando a loadReservations...'); }
function loadStatistics() { console.log('Llamando a loadStatistics...'); }

// ===============================================================
// CÓDIGO QUE SE EJECUTA CUANDO EL DOM ESTÁ LISTO
// ===============================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("Dashboard cargado.");

    // --- OBTENER REFERENCIAS ---
    const usuariosTab = document.getElementById('usuarios-tab');
    const productosTab = document.getElementById('productos-tab');
    const addUserForm = document.getElementById('add-user-form');
    const autoForm = document.getElementById('auto-form'); 
    const cancelEditBtn = document.getElementById('cancelEditBtn'); 
    const logoutBtn = document.getElementById('logoutBtn');
    
    // --- INICIALIZAR MÓDULOS ---
    initImageUploadInput('autoImageUpload'); // Inicializa el input de archivos de autos

    // --- LISTENERS PARA PESTAÑAS ---
    if(usuariosTab) {
        usuariosTab.addEventListener('shown.bs.tab', () => loadUsers());
    }
    if (productosTab) {
        productosTab.addEventListener('shown.bs.tab', () => loadProducts());
    }
    // ... (añadir listeners para otras pestañas) ...

    // --- LISTENER PARA FORMULARIO AÑADIR USUARIO ---
    if (addUserForm) {
        addUserForm.addEventListener('submit', handleUserFormSubmit);
    }

    // --- LISTENER PARA FORMULARIO AUTOS (AÑADIR/EDITAR) ---
    if (autoForm) {
        autoForm.addEventListener('submit', handleAutoFormSubmit);
    }

    // --- LISTENER PARA BOTÓN CANCELAR EDICIÓN (AUTOS) ---
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            resetAutoForm(); // Llama a la función importada
        });
    }

    // --- LISTENER PARA CERRAR SESIÓN ---
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log("Cerrando sesión...");
             // Podrías limpiar localStorage aquí si guardas algo del admin
            window.location.href = 'home.html'; 
        });
    }

    // --- CARGA INICIAL DE DATOS SEGÚN PESTAÑA ACTIVA ---
    if (document.querySelector('#usuarios-panel.active')) { loadUsers(); }
    if (document.querySelector('#productos-panel.active')) { loadProducts(); } 
});