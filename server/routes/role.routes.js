const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const roleController = require("../controllers/role.controller");

router.get("/", authenticate, roleController.getRoles);

module.exports = router;
