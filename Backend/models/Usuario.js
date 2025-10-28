const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true      // Saca espacios en blanco
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,   // No puede haber dos usuarios con el mismo
        trim: true,
        lowercase: true // Guarda siempre en minúsculas
    },
    password: {
        type: String,
        required: true
    },
    // fecha de registro automática
    fechaRegistro: {
        type: Date,
        default: Date.now // Se establece automáticamente al crear el usuario
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;