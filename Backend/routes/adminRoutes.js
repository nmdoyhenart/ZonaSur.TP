const express = require('express');
const { 
    loginAdmin, 
    registrarAdmin, 
    obtenerAdmins, 
    eliminarAdmin,
    logoutAdmin,     
    verificarSesion  
} = require('../controllers/adminController');

const router = express.Router();

// --- Autenticación ---
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/verificar', verificarSesion);

// --- Gestión de Admins ---
router.get('/', obtenerAdmins);
router.delete('/:id', eliminarAdmin);
router.post('/registro', registrarAdmin);

module.exports = router;