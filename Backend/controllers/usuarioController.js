const Usuario = require('../models/Usuario');

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

// Para la tabla de "Usuarios" (visitantes) en el dashboard
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find(); // Busca solo visitantes
        res.json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ msg: 'Error al obtener la lista de usuarios.' });
    }
};

// Para borrar visitantes desde el dashboard
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
        res.status(500).json({ msg: 'Error al eliminar el usuario.' });
    }
};

module.exports = {
    registrarVisitante,
    obtenerUsuarios,
    eliminarUsuario
};