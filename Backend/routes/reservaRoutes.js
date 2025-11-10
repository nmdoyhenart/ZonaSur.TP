const express = require('express');
const { obtenerReservas } = require('../controllers/reservaController');

const router = express.Router();

router.get('/', obtenerReservas);

module.exports = router;