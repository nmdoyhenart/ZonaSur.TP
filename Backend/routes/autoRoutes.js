const express = require('express');
const { 
    obtenerAutos, 
    obtenerAutoPorId, 
    crearAuto, 
    actualizarAuto, 
    eliminarAuto 
} = require('../controllers/autoController');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', obtenerAutos);
router.get('/:id', obtenerAutoPorId);
router.delete('/:id', eliminarAuto);
router.post('/', upload, crearAuto);
router.put('/:id', upload, actualizarAuto);

module.exports = router;