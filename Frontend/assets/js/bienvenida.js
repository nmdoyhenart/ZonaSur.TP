document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('welcome-form');
    const inputNombre = document.getElementById('nombreUsuario');
    const mensajeDiv = document.getElementById('mensaje');

    formulario.addEventListener('submit', async function(e) {
        e.preventDefault(); // Evita que la página se recargue

        const nombre = inputNombre.value.trim(); // Limpiamos espacios
        
        // Validación básica: campo vacío
        if (nombre === '') {
            mensajeDiv.textContent = 'Por favor, ingresa tu nombre.';
            mensajeDiv.classList.add('mensaje-error');
            mensajeDiv.classList.remove('d-none');
            return; // Detenemos si no hay nombre
        }

        try {
            const response = await fetch('http://localhost:4000/api/usuarios/visitante', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre: nombre }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Error al guardar el nombre.');
            }

            // Guardamos el token recibido en el navegador
            localStorage.setItem('token', data.token);

            // Guardamos también el nombre del usuario
            localStorage.setItem('nombreUsuario', nombre);

            window.location.href = 'home.html';

        } catch (error) {
            console.error('Error al registrar visitante:', error);
            mensajeDiv.textContent = error.message || 'No se pudo conectar con el servidor.';
            mensajeDiv.classList.add('mensaje-error');
            mensajeDiv.classList.remove('d-none');
        }
    });
});