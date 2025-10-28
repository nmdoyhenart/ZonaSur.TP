const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const registrarUsuario = async (req, res) => {
    const { email, nombre, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email: email });
        if (usuario) {
            return res.status(400).json({ msg: 'El email ya está registrado.' });
        }

        usuario = new Usuario(req.body);

        // --- ENCRIPTACIÓN ANTES DE GUARDAR ---
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        await usuario.save(); // Ahora se guarda la contraseña hasheada

        res.status(201).json({ msg: 'Usuario registrado exitosamente.' });

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ msg: 'Error en el servidor, intenta más tarde.' });
    }
};

const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' }); // Mensaje genérico
        }

        // --- COMPARACIÓN SEGURA DE CONTRASEÑAS ---
        const passwordCorrecto = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecto) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' });
        }

        res.status(200).json({ 
            msg: 'Inicio de sesión exitoso.', 
            userId: usuario._id,
            nombre: usuario.nombre
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ msg: 'Error en el servidor, intenta más tarde.' });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario
};