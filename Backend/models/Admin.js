const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    fechaRegistro: { 
        type: Date, 
        default: Date.now 
    }
});

// Hook para encriptar la contraseña ANTES de guardarla
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    // Genera el 'salt' y encripta la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;