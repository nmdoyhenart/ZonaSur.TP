const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;