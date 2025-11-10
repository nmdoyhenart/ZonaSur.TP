const Reserva = require('../models/Reserva');

const obtenerReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find().sort({ fechaReserva: -1 });
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener las reservas.' });
    }
};

const crearReserva = async (req, res) => {
    try {
        const nuevaReserva = new Reserva(req.body);
        await nuevaReserva.save();
        res.json({ msg: "Reserva guardada", reserva: nuevaReserva });
    } catch (error) {
        console.error("Error al guardar reserva:", error);
        res.status(500).json({ msg: 'Error al guardar la reserva.' });
    }
};

module.exports = {
    obtenerReservas,
    crearReserva
};