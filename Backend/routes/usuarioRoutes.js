const express = require('express');
const { loginAdm, registrarVisitante } = require('../controllers/usuarioController');

const router = express.Router();

router.post('/login', loginAdm);      
router.post('/visitante', registrarVisitante);

module.exports = router;