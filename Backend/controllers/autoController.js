const Auto = require('../models/Auto');

const obtenerAutos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3; // Traeremos 3 autos por página
        const skip = (page - 1) * limit; // Cuántos saltar

        const filtro = { activo: true };

        // Dos consultas a la vez: documentos de la pag y conteo total
        const [autos, totalAutos] = await Promise.all([
            Auto.find(filtro)
                .skip(skip)
                .limit(limit),
            Auto.countDocuments(filtro)
        ]);

        // Calcular total de páginas
        const totalPages = Math.ceil(totalAutos / limit);

        // Enviar respuesta estructurada
        res.json({
            docs: autos,
            totalPages: totalPages,
            page: page,
            hasNextPage: page < totalPages
        });

    } catch (error) {
        console.error("Error al obtener autos:", error);
        res.status(500).json({ msg: 'Error al obtener los vehículos.' });
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