const express = require('express');
const { obtenerReservas, crearReserva } = require('../controllers/reservaController');

const router = express.Router();

router.get('/', obtenerReservas);
router.post('/', crearReserva);  // <-- AGREGAR

module.exports = router;