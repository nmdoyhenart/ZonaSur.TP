export async function cargarUsuarios() {
    const contenedor = document.getElementById('usuarios-content');
    if (!contenedor) return;

    // Mensaje mientras carga
    contenedor.innerHTML = '<p>Cargando usuarios...</p>';

    try {
        // Hacemos dos peticiones al mismo tiempo: visitantes y administradores
        const [visitantesRes, adminsRes] = await Promise.all([
            fetch('http://localhost:4000/api/usuarios'),
            fetch('http://localhost:4000/api/admin')
        ]);

        // Si alguna falla, mostramos error
        if (!visitantesRes.ok || !adminsRes.ok) {
            throw new Error('No se pudo obtener la lista completa de usuarios.');
        }

        const visitantes = await visitantesRes.json();
        const admins = await adminsRes.json();

        // Unificamos ambas listas, agregando un campo "tipo" para distinguirlos
        const usuarios = [
            ...visitantes.map(v => ({ ...v, tipo: 'visitante' })),
            ...admins.map(a => ({ ...a, tipo: 'admin' }))
        ];

        // Ordenar por fecha de registro (recientes primero)
        usuarios.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));

        if (usuarios.length === 0) {
            contenedor.innerHTML = '<p>No hay usuarios registrados.</p>';
            return;
        }

        // Inicio de tabla HTML
        let tablaHTML = `
            <div class="table-responsive mb-0">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Fecha de registro</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        usuarios.forEach(user => {
            const esAdmin = user.tipo === 'admin';

            tablaHTML += `
                <tr>
                    <td>${user.nombre}</td>
                    <td>${user._id}</td>
                    <td>${user.username || 'visitante'}</td>
                    <td>${new Date(user.fechaRegistro).toLocaleDateString()}</td>
                    <td>
                        ${esAdmin 
                            ? '<i class="bi bi-shield-lock-fill text-success"></i> Admin'
                            : '<i class="bi bi-person-fill text-muted"></i> Visitante'
                        }
                    </td>
                    <td>
                        <button class="btn btn-sm btn-danger btn-eliminar-usuario"
                                data-id="${user._id}"
                                data-tipo="${user.tipo}">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        // Cerrar tabla
        tablaHTML += `</tbody></table></div>`;
        
        // Renderizar
        contenedor.innerHTML = tablaHTML;

        // Asignar evento a cada botón "Eliminar"
        document.querySelectorAll('.btn-eliminar-usuario').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const tipo = e.currentTarget.dataset.tipo;
                eliminarUsuario(id, tipo);
            });
        });

    } catch (error) {
        contenedor.innerHTML = `<p class="text-danger">${error.message}</p>`;
    }
}

async function eliminarUsuario(id, tipo) {
    const dark = document.body.classList.contains("dark-mode");

    const confirm = await Swal.fire({
        title: `¿Eliminar ${tipo}?`,
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        background: dark ? "#2e2e2e" : "#ffffff",
        color: dark ? "#f1f1f1" : "#333",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6"
    });

    if (!confirm.isConfirmed) return;

    // Determinar endpoint según tipo
    let url = tipo === 'admin'
        ? `http://localhost:4000/api/admin/${id}`
        : `http://localhost:4000/api/usuarios/${id}`;

    try {
        const respuesta = await fetch(url, { method: 'DELETE' });
        const data = await respuesta.json();

        // Validar respuesta
        if (!respuesta.ok) throw new Error(data.msg || 'No se pudo eliminar el usuario.');

        // Éxito
        await Swal.fire({
            title: "Usuario eliminado",
            text: data.msg || "El usuario fue eliminado correctamente.",
            icon: "success",
            background: dark ? "#2e2e2e" : "#ffffff",
            color: dark ? "#f1f1f1" : "#333"
        });

        cargarUsuarios();

    } catch (error) {
        // Error
        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            background: dark ? "#2e2e2e" : "#ffffff",
            color: dark ? "#f1f1f1" : "#333"
        });
    }
}

export async function manejarSubmitUsuario(e) {
    e.preventDefault();

    const dark = document.body.classList.contains("dark-mode");

    const nombre = document.getElementById('addUserName').value.trim();
    const username = document.getElementById('addUserUsername').value.trim();
    const esAdmin = document.getElementById('addUserIsAdminCheck').checked;
    const inputPassword = document.getElementById('addUserPassword');
    const password = inputPassword.value;

    let url = '';
    let nuevoUsuario = {};

    // Validación y armado del payload
    if (esAdmin) {
        if (!nombre || !username || !password) {
            return Swal.fire({
                title: "Campos incompletos",
                text: "Nombre, Username y Contraseña son obligatorios para un administrador.",
                icon: "warning",
                background: dark ? "#2e2e2e" : "#ffffff",
                color: dark ? "#f1f1f1" : "#333"
            });
        }

        url = 'http://localhost:4000/api/admin/registro';
        nuevoUsuario = { nombre, username, password };

    } else {
        if (!nombre) {
            return Swal.fire({
                title: "Nombre requerido",
                text: "El nombre es obligatorio para registrar un visitante.",
                icon: "warning",
                background: dark ? "#2e2e2e" : "#ffffff",
                color: dark ? "#f1f1f1" : "#333"
            });
        }

        url = 'http://localhost:4000/api/usuarios/visitante';
        nuevoUsuario = { nombre };
    }

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoUsuario)
        });

        const data = await respuesta.json();

        // Verificar error
        if (!respuesta.ok) throw new Error(data.msg || 'Error al añadir usuario.');

        await Swal.fire({
            title: "Usuario añadido",
            text: "El usuario fue creado exitosamente.",
            icon: "success",
            background: dark ? "#2e2e2e" : "#ffffff",
            color: dark ? "#f1f1f1" : "#333"
        });

        document.getElementById('add-user-form').reset();
        cargarUsuarios();

    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            background: dark ? "#2e2e2e" : "#ffffff",
            color: dark ? "#f1f1f1" : "#333"
        });
    }
}