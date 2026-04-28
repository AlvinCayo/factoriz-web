const express = require('express');
const multer = require('multer'); // Importamos multer
const { registerClient, registerBusiness, loginUser, resetPassword } = require('../controllers/authController');

const router = express.Router();

// Configuramos multer para que guarde el archivo en la memoria temporalmente
const upload = multer({ storage: multer.memoryStorage() });

router.post('/register/client', registerClient);

// Agregamos "upload.single('licenseFile')" a la ruta de negocios
router.post('/register/business', upload.single('licenseFile'), registerBusiness);

router.post('/login', loginUser);
router.post('/reset-password', resetPassword);

module.exports = router;