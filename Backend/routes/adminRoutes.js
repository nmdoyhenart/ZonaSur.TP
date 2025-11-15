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

router.post('/registro', registrarAdmin);
router.post('/login', loginAdmin);
router.get('/verificar', verificarSesion);
router.post('/logout', logoutAdmin); 
router.get('/', obtenerAdmins);
router.delete('/:id', eliminarAdmin);

module.exports = router;