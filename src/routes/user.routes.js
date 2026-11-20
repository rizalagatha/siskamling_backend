// src/routes/user.routes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/login", userController.handleLogin);
router.get("/", userController.requireAdmin, userController.handleList);
router.patch(
  "/:id/status",
  userController.requireAdmin,
  userController.handleSetStatus,
);

module.exports = router;
