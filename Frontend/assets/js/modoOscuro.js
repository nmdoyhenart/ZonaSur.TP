document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon'); 
    const body = document.body;
    const storageKey = 'darkModeEnabled';

    const lunaIconPath = "../img/luna.png"; 
    const solIconPath = "../img/sol.png"; 

    const isDarkMode = localStorage.getItem(storageKey) === 'true';

    if (isDarkMode) {
        body.classList.add('dark-mode');
        darkModeIcon.src = solIconPath;
        darkModeIcon.alt = 'Sol para modo claro';
    } else {
        darkModeIcon.src = lunaIconPath;
        darkModeIcon.alt = 'Luna para modo oscuro';
    }


    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        const isNowDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem(storageKey, isNowDarkMode);

        if (isNowDarkMode) {
            darkModeIcon.src = solIconPath;
            darkModeIcon.alt = 'Sol para modo claro';
        } else {
            darkModeIcon.src = lunaIconPath;
            darkModeIcon.alt = 'Luna para modo oscuro';
        }
    });

});