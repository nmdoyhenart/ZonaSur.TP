const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function(req, res, next) {
    // Obtener token
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso no válido.' });
    }

    // Limpiar token (quitamos "Bearer ")
    const tokenLimpio = token.split(' ')[1]; // "Bearer TOKEN_LARGO" -> "TOKEN_LARGO"
    if (!tokenLimpio) {
        return res.status(401).json({ msg: 'Formato de token no válido.' });
    }

    try {
        const payload = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
        req.usuario = payload.usuario; 
        next();

    } catch (error) {
        console.error("Error de token:", error.message);
        res.status(401).json({ msg: 'Token no es válido o ha expirado.' });
    }
};