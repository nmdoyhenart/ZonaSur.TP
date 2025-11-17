const Auto = require('../models/Auto');

const obtenerAutos = async (req, res) => {
    try {
        const autos = await Auto.find(); // Busca todos los documentos de la colección
        res.json(autos);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener autos' });
    }
};

const obtenerAutoPorId = async (req, res) => {
    try {
        const auto = await Auto.findById(req.params.id); // Busca un auto por su ID
        res.json(auto); // Devuelve el auto encontrado
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener el auto' });
    }
};

const crearAuto = async (req, res) => {
    try {
        // Si vienen archivos (imágenes), extrae los nombres de archivo
        const imagenes = req.files ? req.files.map(f => f.filename) : [];

        // Crea un nuevo documento Auto combinando body + imágenes
        const auto = new Auto({ ...req.body, imagenes });
        await auto.save();

        res.json({ msg: 'Auto creado', auto });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear auto' });
    }
};

const actualizarAuto = async (req, res) => {
    try {
        // Agrega nuevas imágenes si vienen archivos
        const imagenes = req.files ? req.files.map(f => f.filename) : [];

        // Actualiza los datos del auto y agrega nuevas imágenes al array existente
        const auto = await Auto.findByIdAndUpdate(
            req.params.id,
            { ...req.body, $push: { imagenes } }, // agrega al array en lugar de reemplazarlo
            { new: true } // Devuelve el documento actualizado
        );

        res.json({ msg: 'Auto actualizado', auto });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar auto' });
    }
};

const activarAuto = async (req, res) => {
    try {
        const auto = await Auto.findByIdAndUpdate(
            req.params.id,
            { activo: true }, // Cambia el estado a activo
            { new: true }
        );
        res.json({ msg: 'Auto activado', auto });
    } catch (error) {
        res.status(500).json({ msg: 'Error al activar auto' });
    }
};

const desactivarAuto = async (req, res) => {
    try {
        const auto = await Auto.findByIdAndUpdate(
            req.params.id,
            { activo: false }, // Cambia el estado a inactivo
            { new: true }
        );
        res.json({ msg: 'Auto desactivado', auto });
    } catch (error) {
        res.status(500).json({ msg: 'Error al desactivar auto' });
    }
};

module.exports = {
    obtenerAutos,
    obtenerAutoPorId,
    crearAuto,
    actualizarAuto,
    activarAuto,
    desactivarAuto
};