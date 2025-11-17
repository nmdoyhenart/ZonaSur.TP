const Auto = require('../models/Auto');

const obtenerAutos = async (req, res) => {
    try {
        const autos = await Auto.find();
        res.json(autos);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener autos' });
    }
};

const obtenerAutoPorId = async (req, res) => {
    try {
        const auto = await Auto.findById(req.params.id);
        res.json(auto);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener el auto' });
    }
};

const crearAuto = async (req, res) => {
    try {
        const imagenes = req.files ? req.files.map(f => f.filename) : [];
        const auto = new Auto({ ...req.body, imagenes });
        await auto.save();
        res.json({ msg: 'Auto creado', auto });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear auto' });
    }
};

const actualizarAuto = async (req, res) => {
    try {
        const imagenes = req.files ? req.files.map(f => f.filename) : [];
        const auto = await Auto.findByIdAndUpdate(
            req.params.id,
            { ...req.body, $push: { imagenes } },
            { new: true }
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
            { activo: true },
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
            { activo: false },
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