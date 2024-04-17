const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");

router.post("/facebook", authController.loginWithFacebook);
router.post("/google", authController.loginWithGoogle);

module.exports = router;
