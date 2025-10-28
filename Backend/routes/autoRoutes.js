const express = require('express');
const { obtenerAutos } = require('../controllers/autoController');

const router = express.Router();

router.get('/', obtenerAutos);

module.exports = router;