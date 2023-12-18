const express = require("express");
const router = express.Router();
// Login related function here
const loginController = require('../controllers/login/loginController');
// registation related function here
const registrationController = require('../controllers/registration/registrationController');
// Handling all the refresh token
const refreshTokenController = require("../controllers/refresh/refreshController");

const logoutController = require("../controllers/logout/logoutController");

const verifyJWT = require('../middleware/verifyJWT');

router.post("/login", loginController.loginUser);

// get accessToken from refresh token
router.get("/refresh", refreshTokenController.refreshTokenHandler);

// logout user / remove serverside JWT cookies 
router.get("/logout", logoutController.logoutHandler);

// an example for verified data
router.get("/employed", verifyJWT, (req, res) => {
    res.status(200).send({
        message: "Successful access",
    });
});

router.post("/register", registrationController.registerUser);

module.exports = router;
