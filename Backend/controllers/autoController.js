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

module.exports = {
    obtenerAutos
};