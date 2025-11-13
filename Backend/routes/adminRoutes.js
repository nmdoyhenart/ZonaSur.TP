// Backend/routes/adminRoutes.js
const express = require('express');
const { loginAdmin, registrarAdmin, obtenerAdmins, eliminarAdmin } = require('../controllers/adminController');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/registro', registrarAdmin);
router.get('/', obtenerAdmins); 
router.delete('/:id', eliminarAdmin);

module.exports = router;