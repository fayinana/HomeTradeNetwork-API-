const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.delete("/deleteMe", userController.deleteMe);
router.patch("/updateMe", userController.updateMe);

// router.use(authController.restrictTo("admin"));
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);

module.exports = router;
