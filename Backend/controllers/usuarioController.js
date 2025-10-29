const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// --- REGISTRAR VISITANTE ---
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

// --- LOGIN ADMINISTRADOR ---
const loginAdm = async (req, res) => {
    const { nombre, contraseña } = req.body; 

    if (!nombre || !contraseña) {
         return res.status(400).json({ msg: 'Usuario y contraseña son obligatorios.' });
    }

    try {
        const usuario = await Usuario.findOne({ nombre: nombre }); 

        if (!usuario || !usuario.isAdmin || !usuario.contraseña) {
            return res.status(400).json({ msg: 'Credenciales inválidas o usuario no autorizado.' });
        }

        const passwordCorrecto = await bcrypt.compare(constraseña, usuario.contraseña);
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

module.exports = {
    loginAdm,
    registrarVisitante
};