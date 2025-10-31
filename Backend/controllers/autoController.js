const Auto = require('../models/Auto');

const obtenerAutos = async (req, res) => {
    try {
        const autos = await Auto.find();
        res.json(autos);
    } catch (error) {
        console.error("Error al obtener autos:", error);
        res.status(500).json({ msg: 'Error al obtener los vehículos.' });
    }
};

const obtenerAutoPorId = async (req, res) => {
    try {
        const auto = await Auto.findById(req.params.id);
        if (!auto) {
            return res.status(404).json({ msg: 'Auto no encontrado.' });
        }
        res.json(auto);

    } catch (error) {
        console.error("Error al obtener auto por ID:", error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'ID de auto inválido.' });
        }
        res.status(500).json({ msg: 'Error al obtener el vehículo.' });
    }
};

// --- CREAR AUTO (CORREGIDO) ---
const crearAuto = async (req, res) => {
    const { modelo, anio, kilometraje, transmision, color, precio } = req.body;

    const imagenes = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

    try {
        if (!modelo || !anio || !precio || !imagenes || imagenes.length === 0) {
            return res.status(400).json({ msg: 'Faltan campos obligatorios o imágenes.' });
        }

        const nuevoAuto = new Auto({
            modelo,
            anio,
            kilometraje,
            transmision,
            color,
            precio,
            imagenes // 3. Guardar el array de URLs públicas
        });

        const autoGuardado = await nuevoAuto.save();
        res.status(201).json({ msg: 'Auto añadido exitosamente.', auto: autoGuardado });

    } catch (error) {
        console.error("Error al crear auto:", error);
        res.status(500).json({ msg: `Error en el servidor al añadir el auto: ${error.message}` });
    }
};

// --- ACTUALIZAR AUTO (CORREGIDO) ---
const actualizarAuto = async (req, res) => {
    try {
        // 1. Obtener URLs de imágenes existentes que se quieren conservar
        let imagenesExistentes = [];
        if (req.body.existingImages) {
            imagenesExistentes = JSON.parse(req.body.existingImages);
        }

        // 2. Obtener URLs de las nuevas imágenes subidas
       const nuevasImagenes = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

        // 3. Combinar las imágenes viejas (conservadas) y las nuevas
        const todasLasImagenes = [...imagenesExistentes, ...nuevasImagenes];

        // 4. Preparar el resto de los datos a actualizar
        const datosActualizados = { ...req.body };
        datosActualizados.imagenes = todasLasImagenes; // Reemplazar con el array combinado

        // 5. Actualizar la BD
        const auto = await Auto.findByIdAndUpdate(
            req.params.id, 
            { $set: datosActualizados }, // $set es importante para no borrar campos no enviados
            { new: true } // Devuelve el documento actualizado
        );

        if (!auto) {
            return res.status(404).json({ msg: 'Auto no encontrado.' });
        }
        res.json({ msg: 'Auto actualizado correctamente.', auto });
        
    } catch (error) {
        console.error("Error al actualizar auto:", error);
        res.status(500).json({ msg: `Error al actualizar el auto: ${error.message}` });
    }
};

const eliminarAuto = async (req, res) => {
    try {
        const auto = await Auto.findById(req.params.id);
        if (!auto) {
            return res.status(404).json({ msg: 'Auto no encontrado.' });
        }

        await Auto.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Auto eliminado correctamente.' });

    } catch (error) {
        console.error("Error al eliminar auto:", error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'ID de auto inválido.' });
        }
        res.status(500).json({ msg: 'Error al eliminar el auto.' });
    }
};

module.exports = {
    obtenerAutos,
    obtenerAutoPorId,
    crearAuto,
    actualizarAuto,
    eliminarAuto
};