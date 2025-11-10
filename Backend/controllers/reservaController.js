const Reserva = require('../models/Reserva');

const obtenerReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find().sort({ fechaReserva: -1 });
        res.json(reservas);
    } catch (error) {
        console.error("Error al obtener reservas:", error);
        res.status(500).json({ msg: 'Error al obtener las reservas.' });
    }
};

module.exports = {
    obtenerReservas
};