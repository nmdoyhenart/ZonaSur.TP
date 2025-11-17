document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('darkModeToggle'); // Botón que activa/desactiva el modo oscuro
    const darkModeIcon = document.getElementById('darkModeIcon');   // Icono que cambia según el modo
    const body = document.body;                                     // Referencia  para aplicar clase
    const storageKey = 'darkModeEnabled';                           // Clave para guardar preferencia en localStorage

    const lunaIconPath = "../img/luna.png"; 
    const solIconPath = "../img/sol.png";   

    // Comprueba si en localStorage estaba activado el modo oscuro
    const isDarkMode = localStorage.getItem(storageKey) === 'true';

    // Si estaba activado, aplica la clase y cambia el icono
    if (isDarkMode) {
        body.classList.add('dark-mode');
        darkModeIcon.src = solIconPath;
        darkModeIcon.alt = 'Sol para modo claro';
    } else {
        darkModeIcon.src = lunaIconPath;
        darkModeIcon.alt = 'Luna para modo oscuro';
    }

    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode'); // Cambia la clase en body

        const isNowDarkMode = body.classList.contains('dark-mode'); // Estado actual
        localStorage.setItem(storageKey, isNowDarkMode);            // Guarda en localStorage

        // Cambia el icono según el estado
        if (isNowDarkMode) {
            darkModeIcon.src = solIconPath;
            darkModeIcon.alt = 'Sol para modo claro';
        } else {
            darkModeIcon.src = lunaIconPath;
            darkModeIcon.alt = 'Luna para modo oscuro';
        }
    });

});