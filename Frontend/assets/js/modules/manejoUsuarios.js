// Obtener usuarios desde el backend
// Renderizar tabla en el dashboard
// Crear usuarios nuevos
// Eliminar usuarios existentes

export async function cargarUsuarios() {
    const contenedor = document.getElementById('usuarios-content');
    if (!contenedor) return;
    contenedor.innerHTML = '<p>Cargando usuarios...</p>';
    
    try {
        // Hacemos dos peticiones a la API en paralelo
        const [visitantesRes, adminsRes] = await Promise.all([
            fetch('http://localhost:4000/api/usuarios'), // API de Visitantes
            fetch('http://localhost:4000/api/admin')      // API de Admins
        ]);

        if (!visitantesRes.ok || !adminsRes.ok) {
            throw new Error('No se pudo obtener la lista completa de usuarios.');
        }
        
        const visitantes = await visitantesRes.json();
        const admins = await adminsRes.json();

        // Juntamos ambas listas, añadiendo un 'tipo' para saber qué son
        const usuarios = [
            ...visitantes.map(v => ({ ...v, tipo: 'visitante' })),
            ...admins.map(a => ({ ...a, tipo: 'admin' }))
        ];

        // Ordenamos por fecha de registro para que los más nuevos aparezcan primero
        usuarios.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
        
        if (usuarios.length === 0) {
            contenedor.innerHTML = '<p>No hay usuarios registrados.</p>';
            return;
        }

        // --- Renderizar Tabla ---
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
                                data-tipo="${user.tipo}"
                                title="Eliminar ${user.tipo}">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tablaHTML += `</tbody></table></div>`;
        contenedor.innerHTML = tablaHTML; 

        // Reconectamos los listeners para los nuevos botones de borrar
        document.querySelectorAll('.btn-eliminar-usuario').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const tipo = e.currentTarget.dataset.tipo;
                eliminarUsuario(id, tipo);
            });
        });

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        contenedor.innerHTML = `<p class="text-danger">${error.message}</p>`;
    }
}

async function eliminarUsuario(id, tipo) {
    if (!confirm(`¿Estás seguro que querés eliminar a este ${tipo}?`)) return;

    // Elige la URL de la API basado en el tipo
    let url = '';
    if (tipo === 'admin') {
        url = `http://localhost:4000/api/admin/${id}`;
    } else { // 'visitante'
        url = `http://localhost:4000/api/usuarios/${id}`;
    }

    try {
        const respuesta = await fetch(url, {
            method: 'DELETE'
        });
        const data = await respuesta.json();
        if (!respuesta.ok) throw new Error(data.msg || 'No se pudo eliminar el usuario.');

        alert(data.msg || 'Usuario eliminado.');
        cargarUsuarios(); // Recarga la tabla combinada

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert(`Error: ${error.message}`);
    }
}

export async function manejarSubmitUsuario(e) {
    e.preventDefault();

    const nombre = document.getElementById('addUserName').value.trim();
    const username = document.getElementById('addUserUsername').value.trim();
    const esAdmin = document.getElementById('addUserIsAdminCheck').checked;
    const inputPassword = document.getElementById('addUserPassword');
    const password = inputPassword.value;

    let url = '';
    let nuevoUsuario = {};

    if (esAdmin) {
        // --- ES UN ADMIN ---
        if (!nombre || !username || !password) {
            alert('Para administradores, Nombre, Username y Contraseña son obligatorios.');
            inputPassword.focus();
            return;
        }
        // Apunta a la API de registro de Admin
        url = 'http://localhost:4000/api/admin/registro'; 
        nuevoUsuario = { nombre, username, password };

    } else {
        if (!nombre) {
            alert('El nombre es obligatorio para registrar un visitante.');
            return;
        }
        // Apunta a la API de registro de Visitante
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
        if (!respuesta.ok) throw new Error(data.msg || 'Error al añadir usuario.');

        alert('Usuario añadido exitosamente.');
        document.getElementById('add-user-form').reset();
        cargarUsuarios(); // Recarga la tabla combinada

    } catch (error) {
        console.error("Error al añadir usuario:", error);
        alert(`Error: ${error.message}`);
    }
}