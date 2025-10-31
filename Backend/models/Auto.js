const mongoose = require('mongoose');

const autoSchema = new mongoose.Schema({
    modelo: { type: String, required: true, trim: true },
    anio: { type: Number, required: true },
    kilometraje: { type: Number, required: true },
    transmision: { type: String, required: true },
    color: { type: String, required: true },
    precio: { type: Number, required: true },
    imagenes: [{ type: String, required: true }], // Array de strings para las URLs de imagen
});

const Auto = mongoose.model('Auto', autoSchema);

module.exports = Auto;