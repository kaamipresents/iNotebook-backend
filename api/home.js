const express = require("express");
const router = express.Router();

//importing routes controller
const {welcome} = require('../controller/home')

router.get("/", welcome)

module.exports = router;