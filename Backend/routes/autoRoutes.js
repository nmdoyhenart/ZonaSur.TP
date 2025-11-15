const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
    obtenerAutos,
    obtenerAutoPorId,
    crearAuto,
    actualizarAuto,
    activarAuto,
    desactivarAuto
} = require('../controllers/autoController');

router.get('/', obtenerAutos);
router.get('/:id', obtenerAutoPorId);
router.post('/', upload.array('imagenes', 4), crearAuto);
router.put('/:id', upload.array('imagenes', 4), actualizarAuto);

router.put('/activar/:id', activarAuto);
router.put('/desactivar/:id', desactivarAuto);

module.exports = router;