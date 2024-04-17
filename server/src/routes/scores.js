const express = require("express");
const router = express.Router();
const Score = require("../controller/scores.controller");

router.get("/", Score.getScore);
router.put("/:userId", Score.updatePlayerPoints);

module.exports = router;
