// Backend/routes/usuarioRoutes.js
const express = require('express');
const { registrarVisitante, obtenerUsuarios, eliminarUsuario } = require('../controllers/usuarioController');

const router = express.Router();

router.post('/visitante', registrarVisitante); 
router.get('/', obtenerUsuarios); 
router.delete('/:id', eliminarUsuario); 

module.exports = router;