// --- FUNCIONES PARA USUARIOS ---
export async function loadUsers() {
    const usuariosContent = document.getElementById('usuarios-content'); 
    if (!usuariosContent) return; 
    usuariosContent.innerHTML = '<p>Cargando usuarios...</p>'; 
    try {
        const response = await fetch('http://localhost:4000/api/usuarios');
        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de usuarios.');
        }
        const usuarios = await response.json();
        
        if (usuarios.length === 0) {
            usuariosContent.innerHTML = '<p>No hay usuarios registrados.</p>';
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
                        <button class="btn btn-sm btn-danger btn-eliminar-usuario" data-id="${user._id}" title="Eliminar Usuario">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        tablaHTML += `</tbody></table></div>`;
        usuariosContent.innerHTML = tablaHTML; 

        // Añadimos los listeners a los botones de borrar
        document.querySelectorAll('.btn-eliminar-usuario').forEach(button => {
            button.addEventListener('click', (e) => {
                eliminarUsuario(e.currentTarget.dataset.id);
            });
        });

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        usuariosContent.innerHTML = `<p class="text-danger">${error.message || 'Error al cargar usuarios.'}</p>`;
    }
}

async function eliminarUsuario(id) {
    if(confirm(`¿Estás seguro de que quieres eliminar al usuario con ID: ${id}?`)) {
        try {
            const response = await fetch(`http://localhost:4000/api/usuarios/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'No se pudo eliminar el usuario.');
            alert(data.msg || 'Usuario eliminado.');
            loadUsers(); 
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert(`Error: ${error.message}`);
        }
    }
}

export async function handleUserFormSubmit(e) {
    e.preventDefault();
    const nombre = document.getElementById('addUserName').value.trim();
    const username = document.getElementById('addUserUsername').value.trim() || undefined;
    const isAdmin = document.getElementById('addUserIsAdminCheck').checked;
    const passwordInput = document.getElementById('addUserPassword');
    const password = passwordInput.value; 

    if (isAdmin && (!username || !password)) {
        alert('Para administradores, el Username y la Contraseña son obligatorios.');
        passwordInput.focus();
        return;
    }

    const nuevoUsuario = { nombre, isAdmin };
    if (username) nuevoUsuario.username = username; 
    if (isAdmin && password) nuevoUsuario.password = password;

    try {
        const response = await fetch('http://localhost:4000/api/usuarios/registro', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(nuevoUsuario)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || 'Error al añadir usuario.');
        alert('Usuario añadido exitosamente.');
        document.getElementById('add-user-form').reset();
        loadUsers(); 
    } catch (error) {
        console.error("Error al añadir usuario:", error);
        alert(`Error: ${error.message}`);
    }
}