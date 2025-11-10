document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formularioRegistro');
    const btnBorrar = document.getElementById('btnBorrar');
    const mensajeDiv = document.getElementById('mensaje');

    
    btnBorrar.addEventListener('click', () => {
        formulario.reset(); 
        mensajeDiv.textContent = 'Se limpio el formulario.';
        mensajeDiv.classList.remove('mensaje-error', 'mensaje-exito');
        mensajeDiv.style.backgroundColor = '#e9ecef';
        mensajeDiv.style.color = '#000';
    });

    formulario.addEventListener('submit', function(e) {
        e.preventDefault(); 
        mensajeDiv.textContent = ''; 
        mensajeDiv.classList.remove('mensaje-error', 'mensaje-exito');

        const email = document.getElementById('regEmail').value.trim();
        const contrasena = document.getElementById('regContrasena').value;
        const confirmarContrasena = document.getElementById('regConfirmarContrasena').value;
        const fechaNacimiento = document.getElementById('regFechaNac').value;
        
        let errores = [];

        if (contrasena !== confirmarContrasena) { errores.push('Las contraseñas no coinciden.'); }
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || !email.endsWith('@gmail.com')) { errores.push('El email debe ser válido y solo aceptamos cuentas de Gmail.'); }
        if (contrasena.length < 8) { errores.push('La contraseña debe tener al menos 8 caracteres.'); }
    

        if (fechaNacimiento) {
            const hoy = new Date();
            const fechaNac = new Date(fechaNacimiento);
            const edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) { edad--; }
            if (edad < 19) { errores.push('Debes ser mayor de 18 años para registrarte.'); }
        }

        
        if (errores.length > 0) {
            mensajeDiv.classList.add('mensaje-error');
            mensajeDiv.innerHTML = '<p>¡Error en el registro! Revisa los siguientes puntos:</p><ul>' + errores.map(e => `<li>${e}</li>`).join('') + '</ul>';
        } else {
            const datos = { 
                nombre: document.getElementById('regNombre').value,
                apellido: document.getElementById('regApellido').value,
                email: email,
                fecha_nacimiento: fechaNacimiento,
                
            };
            console.log('REGISTRO PROVISORIO EXITOSO. Datos Recopilados:', datos);
            
            mensajeDiv.classList.add('mensaje-exito');
            mensajeDiv.textContent = '¡Registro Provisorio Exitoso! Puedes avanzar.';
            formulario.reset();
        }
    });
});