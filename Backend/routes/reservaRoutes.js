const express = require('express');
const { crearReserva, obtenerReservas } = require('../controllers/reservaController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
    '/',
    auth,                       
    crearReserva         
);

router.get('/', obtenerReservas);

module.exports = router;