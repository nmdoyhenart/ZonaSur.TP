const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        sparse: true,
        trim: true
    },
    contraseña: { 
        type: String 
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;