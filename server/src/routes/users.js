const express = require("express");
const router = express.Router();
const user = require("../controller/users.controller");

router.get("/:userId", user.getOne);

module.exports = router;
