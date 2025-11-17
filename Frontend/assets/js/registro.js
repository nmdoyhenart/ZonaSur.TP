document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formularioRegistro');
    const btnBorrar = document.getElementById('btnBorrar'); 
    const mensajeDiv = document.getElementById('mensaje'); // Div para mostrar mensajes de error o éxito

    // --- Botón "Borrar" ---
    btnBorrar.addEventListener('click', () => {
        formulario.reset();
        mensajeDiv.textContent = 'Se limpio el formulario.'; // Mensaje informativo
        mensajeDiv.classList.remove('mensaje-error', 'mensaje-exito'); // Quita clases previas
        mensajeDiv.style.backgroundColor = '#e9ecef'; 
        mensajeDiv.style.color = '#000';
    });

    // --- Validación y envío del formulario ---
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        mensajeDiv.textContent = ''; 
        mensajeDiv.classList.remove('mensaje-error', 'mensaje-exito');

        // Captura de valores
        const email = document.getElementById('regEmail').value.trim();
        const contrasena = document.getElementById('regContrasena').value;
        const confirmarContrasena = document.getElementById('regConfirmarContrasena').value;
        const fechaNacimiento = document.getElementById('regFechaNac').value;

        let errores = [];

        // Validaciones
        if (contrasena !== confirmarContrasena) {
            errores.push('Las contraseñas no coinciden.');
        }

        // Email debe ser válido y ser Gmail
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || !email.endsWith('@gmail.com')) {
            errores.push('El email debe ser válido y solo aceptamos cuentas de Gmail.');
        }

        // Contraseña mínima de 8 caracteres
        if (contrasena.length < 8) {
            errores.push('La contraseña debe tener al menos 8 caracteres.');
        }

        // Validación de edad (mayor de 18 años)
        if (fechaNacimiento) {
            const hoy = new Date();
            const fechaNac = new Date(fechaNacimiento);
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                edad--;
            }
            if (edad < 19) {
                errores.push('Debes ser mayor de 18 años para registrarte.');
            }
        }

        // --- Mostrar errores o éxito ---
        if (errores.length > 0) {
            // Si hay errores, mostrar lista de errores en el div
            mensajeDiv.classList.add('mensaje-error');
            mensajeDiv.innerHTML = '<p>¡Error en el registro! Revisa los siguientes puntos:</p><ul>' + 
                errores.map(e => `<li>${e}</li>`).join('') + '</ul>';
        } else {
            // Si no hay errores, capturar datos y mostrar mensaje de éxito
            const datos = { 
                nombre: document.getElementById('regNombre').value,
                apellido: document.getElementById('regApellido').value,
                email: email,
                fecha_nacimiento: fechaNacimiento
            };
            
            mensajeDiv.classList.add('mensaje-exito');
            mensajeDiv.textContent = '¡Registro Provisorio Exitoso! Puedes avanzar.';
            formulario.reset(); // Limpia el formulario tras registro exitoso
        }
    });
});