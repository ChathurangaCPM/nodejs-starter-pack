const express = require("express");
const router = express.Router();
const loginController = require('../../controllers/login/loginController');

router.post("/", loginController.loginUser);

module.exports = router;
