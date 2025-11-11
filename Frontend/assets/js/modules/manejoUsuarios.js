// Obtener usuarios desde el backend
// Renderizar tabla en el dashboard
// Crear usuarios nuevos
// Eliminar usuarios existentes

export async function cargarUsuarios() {
    const contenedor = document.getElementById('usuarios-content');
    if (!contenedor) return;

    contenedor.innerHTML = '<p>Cargando usuarios...</p>';

    try {
        const respuesta = await fetch('http://localhost:4000/api/usuarios');
        if (!respuesta.ok) throw new Error('No se pudo obtener la lista de usuarios.');

        const usuarios = await respuesta.json();

        if (usuarios.length === 0) {
            contenedor.innerHTML = '<p>No hay usuarios registrados.</p>';
            return;
        }

        let tablaHTML = `
            <div class="table-responsive mb-0">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Fecha de registro</th>
                            <th>Administrador</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        usuarios.forEach(user => {
            tablaHTML += `
                <tr>
                    <td>${user.nombre}</td>
                    <td>${user._id}</td>
                    <td>${user.username || user.email || 'N/A'}</td>
                    <td>${new Date(user.fechaRegistro).toLocaleDateString()}</td>
                    <td>${user.isAdmin ? '<i class="bi bi-check-circle-fill text-success"></i> Sí' : 'No'}</td>

                    <td>
                        <!-- Botón eliminar -->
                        <button class="btn btn-sm btn-danger btn-eliminar-usuario"
                                data-id="${user._id}"
                                title="Eliminar Usuario">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tablaHTML += `
                    </tbody>
                </table>
            </div>
        `;

        contenedor.innerHTML = tablaHTML;

        document.querySelectorAll('.btn-eliminar-usuario').forEach(btn => {
            btn.addEventListener('click', (e) => {
                eliminarUsuario(e.currentTarget.dataset.id);
            });
        });

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        contenedor.innerHTML = `<p class="text-danger">${error.message}</p>`;
    }
}

async function eliminarUsuario(id) {

    if (!confirm(`¿Estás seguro que querés eliminar al usuario con ID: ${id}?`)) return;

    try {
        const respuesta = await fetch(`http://localhost:4000/api/usuarios/${id}`, {
            method: 'DELETE'
        });

        const data = await respuesta.json();

        if (!respuesta.ok) throw new Error(data.msg || 'No se pudo eliminar el usuario.');

        alert(data.msg || 'Usuario eliminado.');
        cargarUsuarios();

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert(`Error: ${error.message}`);
    }
}

export async function manejarSubmitUsuario(e) {

    e.preventDefault();

    const nombre = document.getElementById('addUserName').value.trim();
    const username = document.getElementById('addUserUsername').value.trim() || undefined;
    const esAdmin = document.getElementById('addUserIsAdminCheck').checked;
    const inputPassword = document.getElementById('addUserPassword');
    const password = inputPassword.value;

    if (esAdmin && (!username || !password)) {
        alert('Para administradores, Username y Contraseña son obligatorios.');
        inputPassword.focus();
        return;
    }

    const nuevoUsuario = { nombre, isAdmin: esAdmin };
    if (username) nuevoUsuario.username = username;
    if (esAdmin && password) nuevoUsuario.password = password;

    try {
        const respuesta = await fetch('http://localhost:4000/api/usuarios/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoUsuario)
        });

        const data = await respuesta.json();

        if (!respuesta.ok) throw new Error(data.msg || 'Error al añadir usuario.');

        alert('Usuario añadido exitosamente.');

        document.getElementById('add-user-form').reset();
        cargarUsuarios(); 

    } catch (error) {
        console.error("Error al añadir usuario:", error);
        alert(`Error: ${error.message}`);
    }
}