const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
    obtenerMotos,
    obtenerMotoPorId,
    crearMoto,
    actualizarMoto,
    activarMoto,
    desactivarMoto
} = require('../controllers/motoController');

router.get('/', obtenerMotos);
router.get('/:id', obtenerMotoPorId);
router.post('/', upload.array('imagenes', 4), crearMoto);
router.put('/:id', upload.array('imagenes', 4), actualizarMoto);

router.put('/activar/:id', activarMoto);
router.put('/desactivar/:id', desactivarMoto);

module.exports = router;