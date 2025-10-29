const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },

    username: { 
        type: String,
        unique: true,
        sparse: true, // Permite múltiples null/undefined si no se usa
        trim: true
    },
    password: { 
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