document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('login-form');
    const mensajeDiv = document.getElementById('mensaje');
    const usernameInput = document.getElementById('username'); 
    const passwordInput = document.getElementById('password'); 
    const quickAccessBtn = document.getElementById('quickAccessBtn');

    // Botón de acceso rápido
    if (quickAccessBtn) {
        quickAccessBtn.addEventListener('click', () => {
            usernameInput.value = 'administrador'; 
            passwordInput.value = 'admin1234';
        });
    }

    formulario.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const contrasena = passwordInput.value;

        mensajeDiv.innerHTML = ''; 
        mensajeDiv.classList.remove('mensaje-error', 'mensaje-exito');
        mensajeDiv.classList.add('d-none');

        // Validación frontend
        let errores = [];
        if (!username || !contrasena) {
            errores.push('Ambos campos son obligatorios.');
        } 
        if (errores.length > 0) {
            mensajeDiv.classList.add('mensaje-error');
            mensajeDiv.innerHTML = '<p>¡Error al ingresar!</p><ul>' + errores.map(e => `<li>${e}</li>`).join('') + '</ul>';
            mensajeDiv.classList.remove('d-none');
            return;
        }

        const datosLogin = { 
            username: username,
            password: contrasena 
        };
        
        try {
            const response = await fetch('http://localhost:4000/api/admin/login', { 
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(datosLogin) 
            });
            
            const data = await response.json();

            if (response.ok) { 
                window.location.href = 'dashboard.html';
            } else {
                mensajeDiv.classList.add('mensaje-error');
                mensajeDiv.textContent = data.msg || 'Error al iniciar sesión.';
                mensajeDiv.classList.remove('d-none');
            }

        } catch (error) {
            mensajeDiv.classList.add('mensaje-error');
            mensajeDiv.textContent = 'No se pudo conectar con el servidor.';
            mensajeDiv.classList.remove('d-none');
        }
    });
});