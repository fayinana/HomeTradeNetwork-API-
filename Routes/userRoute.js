const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);
router.post("/logout", authController.logout);
router.delete("/deleteMe", userController.deleteMe);
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.route("/me").get(userController.getMe, userController.getUser);
router.patch("/changePassword", authController.updatePassword);
router.use(authController.restrictTo("admin"));
router.get("/", userController.getUsers);
router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

module.exports = router;
