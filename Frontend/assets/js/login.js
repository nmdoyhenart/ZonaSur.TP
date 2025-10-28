document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('login-form');
    const mensajeDiv = document.getElementById('mensaje');

    formulario.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        mensajeDiv.innerHTML = ''; 
        mensajeDiv.classList.remove('mensaje-error', 'mensaje-exito');
        mensajeDiv.classList.add('d-none'); 

        const email = document.getElementById('email').value.trim();
        const contrasena = document.getElementById('password').value;
        
        let errores = [];

        if (!email || !contrasena) {
            errores.push('Ambos campos son obligatorios.');
        } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errores.push('El formato del email no es válido.');
        }

        if (errores.length > 0) {
            mensajeDiv.classList.add('mensaje-error');
            mensajeDiv.innerHTML = '<p>¡Error al ingresar!</p><ul>' + errores.map(e => `<li>${e}</li>`).join('') + '</ul>';
            mensajeDiv.classList.remove('d-none');
            return;
        } 
        
        // ENVÍO DE DATOS AL BACKEND
        const datosLogin = { 
            email: email,
            password: contrasena 
        };

        try {
            const response = await fetch('http://localhost:4000/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosLogin)
            });

            const data = await response.json();

            mensajeDiv.classList.remove('d-none'); 
            if (response.ok) {
                mensajeDiv.classList.add('mensaje-exito');
                mensajeDiv.textContent = data.msg || '¡Ingreso Exitoso! Redirigiendo...';
                
                console.log('Login exitoso, ID de usuario:', data.userId);

                setTimeout(() => {
                    window.location.href = 'home.html'; 
                }, 2000);

            } else {
                mensajeDiv.classList.add('mensaje-error');
                mensajeDiv.textContent = data.msg || 'Error al iniciar sesión.';
            }

        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            mensajeDiv.classList.remove('d-none');
            mensajeDiv.classList.add('mensaje-error');
            mensajeDiv.textContent = 'No se pudo conectar con el servidor.';
        }
    });
});