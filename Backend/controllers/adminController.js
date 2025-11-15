const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

const registrarAdmin = async (req, res) => {
    const { nombre, username, password } = req.body;
    try {
        if (!nombre || !username || !password) {
            return res.status(400).json({ msg: 'Nombre, username y password son obligatorios.' });
        }
        let admin = await Admin.findOne({ username });
        if (admin) {
            return res.status(400).json({ msg: 'El username de admin ya existe.' });
        }
        
        admin = new Admin({ nombre, username, password });
        await admin.save(); 
        
        res.status(201).json({ msg: 'Administrador creado exitosamente.' });
    } catch (error) {
        console.error("Error al registrar admin:", error);
        res.status(500).json({ msg: 'Error al registrar admin.' });
    }
};

const loginAdmin = async (req, res) => {
    const { username, password } = req.body; 
    try {
        if (!username || !password) {
            return res.status(400).json({ msg: 'Usuario y contraseña son obligatorios.' });
        }
        
        const admin = await Admin.findOne({ username: username }); 
        if (!admin) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' });
        }

        const passwordCorrecto = await bcrypt.compare(password, admin.password);
        if (!passwordCorrecto) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' });
        }

        // Guardar los datos del admin en la sesión del servidor
        req.session.admin = {
            id: admin._id,
            nombre: admin.nombre,
            username: admin.username
        };

        // Guardar la sesión
        req.session.save((err) => {
            if (err) {
                console.error("Error al guardar la sesión:", err);
                return res.status(500).json({ msg: 'Error al iniciar sesión.' });
            }
            res.status(200).json({ 
                msg: 'Inicio de sesión de administrador exitoso.', 
                admin: req.session.admin
            });
        });

    } catch (error) {
        console.error("Error al iniciar sesión admin:", error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

const obtenerAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-password');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener admins.' });
    }
};

const eliminarAdmin = async (req, res) => {
    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Admin eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar admin.' });
    }
};

const logoutAdmin = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ msg: 'Error al cerrar sesión.' });
        }
        // Limpiamos la cookie en el navegador

        res.clearCookie('connect.sid'); // Nombre por defecto de la cookie
        res.status(200).json({ msg: 'Sesión cerrada exitosamente.' });
    });
};

const verificarSesion = (req, res) => {
    if (req.session.admin) {
        // Si hay una sesión activa, devuelve los datos del admin
        res.status(200).json({ admin: req.session.admin });
    } else {
        res.status(401).json({ msg: 'No autorizado.' });
    }
};


module.exports = {
    registrarAdmin,
    loginAdmin,
    logoutAdmin,     
    verificarSesion,
    obtenerAdmins,
    eliminarAdmin
};