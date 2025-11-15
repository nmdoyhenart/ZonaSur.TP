const express = require('express');
const { obtenerReservas, crearReserva } = require('../controllers/reservaController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, crearReserva);
router.get('/', obtenerReservas);
router.post('/', crearReserva);  // <-- AGREGAR

module.exports = router;