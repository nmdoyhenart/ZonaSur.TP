const express = require('express');
const { loginAdm, registrarVisitante, obtenerUsuarios, eliminarUsuario, registrarUsuario } = require('../controllers/usuarioController');

const router = express.Router();

router.post('/login', loginAdm);      
router.post('/visitante', registrarVisitante);
router.get('/', obtenerUsuarios);
router.delete('/:id', eliminarUsuario);
router.post('/registro', registrarUsuario);

module.exports = router;