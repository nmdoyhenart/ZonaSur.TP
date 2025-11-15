const Moto = require('../models/Moto');

const obtenerMotos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit; // Cuántos saltar

        const filtro = { activo: true }; // Solo motos activas

        // Dos consultas: documentos y  total
        const [motos, totalMotos] = await Promise.all([
            Moto.find(filtro)
                .skip(skip)
                .limit(limit),
            Moto.countDocuments(filtro)
        ]);

        // Calcular total de páginas
        const totalPages = Math.ceil(totalMotos / limit);

        res.json({
            docs: motos,
            totalPages: totalPages,
            page: page,
            hasNextPage: page < totalPages
        });

    } catch (error) {
        console.error("Error al obtener motos:", error);
        res.status(500).json({ msg: 'Error al obtener las motocicletas.' });
    }
};

const obtenerMotoPorId = async (req, res) => {
    try {
        const moto = await Moto.findById(req.params.id);
        res.json(moto);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener la moto' });
    }
};

const crearMoto = async (req, res) => {
    try {
        const imagenes = req.files ? req.files.map(f => f.filename) : [];
        const moto = new Moto({ ...req.body, imagenes });
        await moto.save();
        res.json({ msg: 'Moto creada', moto });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear moto' });
    }
};

const actualizarMoto = async (req, res) => {
    try {
        const imagenes = req.files ? req.files.map(f => f.filename) : [];
        const moto = await Moto.findByIdAndUpdate(
            req.params.id,
            { ...req.body, $push: { imagenes } },
            { new: true }
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
            { activo: true },
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
            { activo: false },
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