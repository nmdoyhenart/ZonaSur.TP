document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('welcome-form');
    const inputNombre = document.getElementById('nombreUsuario');
    const mensajeDiv = document.getElementById('mensaje');

    formulario.addEventListener('submit', async function(e) {
        e.preventDefault();
        const nombre = inputNombre.value.trim();
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

            localStorage.setItem('token', data.token);

            localStorage.setItem('nombreUsuario', nombre);

            console.log('Visitante guardado y token recibido.');
            window.location.href = 'home.html';

        } catch (error) {
            console.error('Error al registrar visitante:', error);
            mensajeDiv.textContent = error.message || 'No se pudo conectar con el servidor.';
            mensajeDiv.classList.add('mensaje-error');
            mensajeDiv.classList.remove('d-none');
        }
    });
});