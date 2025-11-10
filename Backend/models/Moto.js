const mongoose = require('mongoose');

const motoSchema = new mongoose.Schema({
    modelo: { type: String, required: true, trim: true },
    anio: { type: Number, required: true },
    kilometraje: { type: Number, required: true },
    cilindrada: { type: Number, required: true },
    color: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true, default: 5 },
    imagenes: [{ type: String, required: true }]
});

const Moto = mongoose.model('Moto', motoSchema);

module.exports = Moto;