const mongoose = require('mongoose');

const productoReservadoSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    modelo: { type: String, required: true },
    cantidad: { type: Number, required: true },
    montoReserva: { type: Number, required: true }
});

const reservaSchema = new mongoose.Schema({
    usuarioNombre: {
        type: String,
        required: true,
        trim: true
    },
    productos: [productoReservadoSchema],
    
    totalReserva: {
        type: Number,
        required: true
    },
    fechaReserva: {
        type: Date,
        default: Date.now
    }
});

const Reserva = mongoose.model('Reserva', reservaSchema);
module.exports = Reserva;