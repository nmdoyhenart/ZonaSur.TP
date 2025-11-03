const Moto = require('../models/Moto');

const obtenerMotos = async (req, res) => {
    try {
        const motos = await Moto.find();
        res.json(motos);
    } catch (error) {
        console.error("Error al obtener motos:", error);
        res.status(500).json({ msg: 'Error al obtener los vehículos.' });
    }
};

const obtenerMotoPorId = async (req, res) => {
    try {
        const moto = await Moto.findById(req.params.id);
        if (!moto) {
            return res.status(404).json({ msg: 'Moto no encontrada.' });
        }
        res.json(moto);

    } catch (error) {
        console.error("Error al obtener moto por ID:", error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'ID de moto inválido.' });
        }
        res.status(500).json({ msg: 'Error al obtener la moto.' });
    }
};

const crearMoto = async (req, res) => {
    const { modelo, anio, kilometraje, cilindrada, color, precio } = req.body;

    const imagenes = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

    try {
        if (!modelo || !anio || !precio || !kilometraje || !cilindrada || !color || !imagenes || imagenes.length === 0) {
            return res.status(400).json({ msg: 'Faltan campos obligatorios o imágenes.' });
        }

        const nuevaMoto = new Moto({
            modelo,
            anio,
            kilometraje,
            cilindrada,
            color,
            precio,
            imagenes
        });

        const motoGuardado = await nuevaMoto.save();
        res.status(201).json({ msg: 'Moto añadida exitosamente.', auto: motoGuardado });

    } catch (error) {
        console.error("Error al crear moto:", error);
        res.status(500).json({ msg: `Error en el servidor al añadir la moto: ${error.message}` });
    }
};

const actualizarMoto = async (req, res) => {
    try {
        let imagenesExistentes = [];
        if (req.body.existingImages) {
            imagenesExistentes = JSON.parse(req.body.existingImages);
        }

        const nuevasImagenes = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

        const todasLasImagenes = [...imagenesExistentes, ...nuevasImagenes];

        const datosActualizados = { ...req.body };
        datosActualizados.imagenes = todasLasImagenes;

        const moto = await Moto.findByIdAndUpdate(
            req.params.id, 
            { $set: datosActualizados },
            { new: true }
        );

        if (!moto) {
            return res.status(404).json({ msg: 'Moto no encontrada.' });
        }
        res.json({ msg: 'Moto actualizada correctamente.', moto });
        
    } catch (error) {
        console.error("Error al actualizar moto: ", error);
        res.status(500).json({ msg: `Error al actualizar la moto: ${error.message}` });
    }
};

const eliminarMoto = async (req, res) => {
    try {
        const moto = await Moto.findById(req.params.id);
        if (!moto) {
            return res.status(404).json({ msg: 'Moto no encontrada.' });
        }

        await Moto.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Moto eliminada correctamente.' });

    } catch (error) {
        console.error("Error al eliminar auto:", error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'ID de moto inválida.' });
        }
        res.status(500).json({ msg: 'Error al eliminar la moto.' });
    }
};

module.exports = {
    obtenerMotos,
    obtenerMotoPorId,
    crearMoto,
    actualizarMoto,
    eliminarMoto
};