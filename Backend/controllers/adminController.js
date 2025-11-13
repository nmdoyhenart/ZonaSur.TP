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

        res.status(200).json({ 
            msg: 'Inicio de sesión de administrador exitoso.', 
            userId: admin._id,
            nombre: admin.nombre,
            isAdmin: true // Siempre enviamos 'true' porque es un admin
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

module.exports = {
    registrarAdmin,
    loginAdmin,
    obtenerAdmins,
    eliminarAdmin
};