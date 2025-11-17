const Usuario = require('../models/Usuario'); 
const jwt = require('jsonwebtoken'); 

const dotenv = require('dotenv');
dotenv.config();

// Registra un visitante y genera un token JWT con su información
const registrarVisitante = async (req, res) => {
    const { nombre } = req.body; // Obtiene el nombre del visitante

    // Validación básica: el nombre es obligatorio
    if (!nombre) {
        return res.status(400).json({ msg: 'El nombre es obligatorio.' });
    }
    
    try {
        // Crea un documento de visitante
        const nuevoVisitante = new Usuario({ nombre });
        await nuevoVisitante.save();

        // Payload que será incluido dentro del token
        const payload = {
            usuario: {
                id: nuevoVisitante._id,
                nombre: nuevoVisitante.nombre
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Clave tomada del .env
            { expiresIn: '30m' },
            (error, token) => {
                if (error) throw error;

                res.status(201).json({ 
                    msg: 'Visitante registrado exitosamente.',
                    token: token // Devuelve el token al front
                });
            }
        );

    } catch (error) {
        console.error("Error al registrar visitante:", error);
        res.status(500).json({ msg: 'Error en el servidor al guardar el nombre.' });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find(); // Busca todos los visitantes
        res.json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ msg: 'Error al obtener la lista de usuarios.' });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id); // Busca el usuario primero
        
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' }); // Valida que exista
        }

        await Usuario.findByIdAndDelete(req.params.id); // Lo elimina
        res.json({ msg: 'Usuario eliminado correctamente.' });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ msg: 'Error al eliminar el usuario.' });
    }
};

module.exports = {
    registrarVisitante,
    obtenerUsuarios,
    eliminarUsuario
};