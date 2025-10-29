const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const registrarVisitante = async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ msg: 'El nombre es obligatorio.' });
    }
    try {
        const nuevoVisitante = new Usuario({ nombre });
        await nuevoVisitante.save();
        res.status(201).json({ 
            msg: 'Visitante registrado exitosamente.',
            visitante: nuevoVisitante
        });
    } catch (error) {
        console.error("Error al registrar visitante:", error);
        res.status(500).json({ msg: 'Error en el servidor al guardar el nombre.' });
    }
};

const loginAdm = async (req, res) => {
    const { username, password } = req.body; 

    if (!username || !password) {
        return res.status(400).json({ msg: 'Usuario y contraseña son obligatorios.' });
    }

    try {
        const usuario = await Usuario.findOne({ username: username }); 

        if (!usuario || !usuario.isAdmin || !usuario.password) {
            return res.status(400).json({ msg: 'Credenciales inválidas o usuario no autorizado.' });
        }

        const passwordCorrecto = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecto) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' });
        }

        res.status(200).json({ 
            msg: 'Inicio de sesión de administrador exitoso.', 
            userId: usuario._id,
            nombre: usuario.nombre,
            isAdmin: usuario.isAdmin
        });

    } catch (error) {
        console.error("Error al iniciar sesión admin:", error);
        res.status(500).json({ msg: 'Error en el servidor, intenta más tarde.' });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password'); // Excluir password
        res.json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ msg: 'Error al obtener la lista de usuarios.' });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        await Usuario.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Usuario eliminado correctamente.' });

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ msg: 'ID de usuario inválido.' });
        }
        res.status(500).json({ msg: 'Error al eliminar el usuario.' });
    }
};

const registrarUsuario = async (req, res) => {
    // Recibe los campos del frontend
    const { nombre, username, password, isAdmin } = req.body;

    try {
        if (!nombre) {
             return res.status(400).json({ msg: 'El nombre es obligatorio.' });
        }

        // Verifica duplicados de username si se proporciona
        if (username) {
            const userExistente = await Usuario.findOne({ username });
            if (userExistente) {
                return res.status(400).json({ msg: 'El username ya está en uso.' });
            }
        }
        
        // Prepara los datos del nuevo usuario
        const nuevoUsuarioData = { 
            nombre, 
            username: username || undefined, 
            isAdmin: isAdmin === true // Asegura que sea booleano
        };

        // Si se envió una contraseña, la hasheamos
        if (password) {
            const salt = await bcrypt.genSalt(10);
            nuevoUsuarioData.password = await bcrypt.hash(password, salt);
        } else if (isAdmin && username) {
             // Si es admin y no se envió password, puedes decidir qué hacer
             // (Poner una por defecto, devolver error, etc.)
             console.warn(`Admin ${username} creado sin contraseña inicial via dashboard.`);
             // Por ahora, permite crearlo sin password (login fallará hasta que se actualice)
        }

        const usuario = new Usuario(nuevoUsuarioData);
        await usuario.save(); // Guarda en la BD

        // Devuelve el usuario sin la contraseña
        const usuarioCreado = usuario.toObject();
        delete usuarioCreado.password; 

        res.status(201).json({ msg: 'Usuario creado exitosamente.', usuario: usuarioCreado });

    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ msg: 'Error en el servidor al crear usuario.' });
    }
};

module.exports = {
    loginAdm,
    registrarVisitante,
    obtenerUsuarios,
    eliminarUsuario,
    registrarUsuario
};