document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formularioRegistro');
    const btnBorrar = document.getElementById('btnBorrar');
    const mensajeDiv = document.getElementById('mensaje');

    btnBorrar.addEventListener('click', () => {
        formulario.reset(); 
        mensajeDiv.textContent = 'Se limpió el formulario.';
        mensajeDiv.classList.remove('mensaje-error', 'mensaje-exito', 'd-none');
        mensajeDiv.style.backgroundColor = '#e9ecef';
        mensajeDiv.style.color = '#000';
    });

    formulario.addEventListener('submit', async function(e) { 
        e.preventDefault(); 
        mensajeDiv.textContent = ''; 
        mensajeDiv.classList.remove('mensaje-error', 'mensaje-exito');
        mensajeDiv.classList.add('d-none'); 

        const nombre = document.getElementById('regNombre').value.trim();
        const apellido = document.getElementById('regApellido').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const contrasena = document.getElementById('regContrasena').value;
        const confirmarContrasena = document.getElementById('regConfirmarContrasena').value;
        const fechaNacimiento = document.getElementById('regFechaNac').value;
        
        let errores = [];

        if (!nombre || !apellido || !email || !contrasena || !confirmarContrasena || !fechaNacimiento) {
             errores.push('Todos los campos son obligatorios.');
        } else {
            if (contrasena !== confirmarContrasena) { errores.push('Las contraseñas no coinciden.'); }
            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { errores.push('El email no es válido.'); }
            if (contrasena.length < 8) { errores.push('La contraseña debe tener al menos 8 caracteres.'); }
        
            const hoy = new Date();
            const fechaNac = new Date(fechaNacimiento);
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) { edad--; }
            if (edad < 18) { errores.push('Debes ser mayor de 18 años para registrarte.'); }
        }

        if (errores.length > 0) {
            mensajeDiv.classList.add('mensaje-error');
            mensajeDiv.innerHTML = '<p>¡Error en el registro! Revisa los siguientes puntos:</p><ul>' + errores.map(e => `<li>${e}</li>`).join('') + '</ul>';
            mensajeDiv.classList.remove('d-none');
            return;
        } 
        
        // ENVÍO DE DATOS AL BACKEND
        const datosUsuario = { 
            nombre: nombre,
            apellido: apellido,
            email: email,
            password: contrasena
        };

        try {
            const response = await fetch('http://localhost:4000/api/usuarios/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosUsuario)
            });

            const data = await response.json();

            // Mostramos el mensaje del servidor
            mensajeDiv.classList.remove('d-none'); 
            if (response.ok) { 
                mensajeDiv.classList.add('mensaje-exito');
                mensajeDiv.textContent = data.msg || '¡Registro Exitoso!';
                formulario.reset();
            } else { // Si el status code es error
                mensajeDiv.classList.add('mensaje-error');
                mensajeDiv.textContent = data.msg || 'Error en el registro.';
            }

        } catch (error) {
            // Error de red o al procesar la respuesta
            console.error('Error al conectar con el servidor:', error);
            mensajeDiv.classList.remove('d-none');
            mensajeDiv.classList.add('mensaje-error');
            mensajeDiv.textContent = 'No se pudo conectar con el servidor.';
        }
    });
});