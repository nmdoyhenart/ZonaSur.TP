const Moto = require('../models/Moto');

const obtenerMotos = async (req, res) => {
    try {
        const motos = await Moto.find(); // Busca todos los documentos en la colección
        res.json(motos); // Devuelve el listado
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener motos' });
    }
};

const obtenerMotoPorId = async (req, res) => {
    try {
        const moto = await Moto.findById(req.params.id); // Busca una moto por su ID
        res.json(moto); // Devuelve Moto encontrada
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener la moto' });
    }
};

const crearMoto = async (req, res) => {
    try {
        // Extrae las imágenes si se subieron archivos
        const imagenes = req.files ? req.files.map(f => f.filename) : [];

        // Crea una nueva instancia de Moto combinando datos + imágenes
        const moto = new Moto({ ...req.body, imagenes });
        await moto.save();

        res.json({ msg: 'Moto creada', moto });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear moto' });
    }
};

const actualizarMoto = async (req, res) => {
    try {
        // Obtiene nuevas imágenes si se cargaron
        const imagenes = req.files ? req.files.map(f => f.filename) : [];

        // Actualiza los datos y agrega nuevas imágenes al array existente
        const moto = await Moto.findByIdAndUpdate(
            req.params.id,
            { ...req.body, $push: { imagenes } }, // $push agrega elementos al array imágenes
            { new: true } // Devuelve el documento actualizado
        );
        res.json({ msg: 'Moto actualizada', moto });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar moto' });
    }
};

const activarMoto = async (req, res) => {
    try {
        const moto = await Moto.findByIdAndUpdate(
            req.params.id,
            { activo: true }, // Marca como activa
            { new: true }
        );
        res.json({ msg: 'Moto activada', moto });
    } catch (error) {
        res.status(500).json({ msg: 'Error al activar moto' });
    }
};

const desactivarMoto = async (req, res) => {
    try {
        const moto = await Moto.findByIdAndUpdate(
            req.params.id,
            { activo: false }, // Marca como inactiva
            { new: true }
        );
        res.json({ msg: 'Moto desactivada', moto });
    } catch (error) {
        res.status(500).json({ msg: 'Error al desactivar moto' });
    }
};

module.exports = {
    obtenerMotos,
    obtenerMotoPorId,
    crearMoto,
    actualizarMoto,
    activarMoto,
    desactivarMoto
};