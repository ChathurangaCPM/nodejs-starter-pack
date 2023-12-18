const express = require("express");
const router = express.Router();
const registrationController = require('../../controllers/registration/registrationController');

router.post("/", registrationController.registerUser);

module.exports = router;
