const Reserva = require('../models/Reserva');

const obtenerReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find().sort({ fechaReserva: -1 }); // Busca todas y las ordena DESC
        res.json(reservas); // Devuelve el listado de reservas
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener las reservas.' }); // Respuesta en caso de error del servidor
    }
};

const crearReserva = async (req, res) => {
    try {
        const nuevaReserva = new Reserva(req.body); // Crea una nueva instancia del modelo

        res.json({ msg: "Reserva guardada", reserva: nuevaReserva }); // Devuelve confirmación
    } catch (error) {
        res.status(500).json({ msg: 'Error al guardar la reserva.' }); 
    }
};

module.exports = {
    obtenerReservas,
    crearReserva
};