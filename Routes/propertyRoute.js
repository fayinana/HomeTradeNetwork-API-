const express = require("express");
const propertyController = require("./../controllers/propertyController");
const authController = require("../controllers/authController");
const router = express.Router();
router.get(
  "/top-five-cheap",
  propertyController.getTopFive,
  propertyController.getAllProperty
);
router.use(authController.protect);
router
  .route("/")
  .get(propertyController.getAllProperty)
  .post(propertyController.createProperty);
router
  .route("/:id")
  .get(propertyController.getProperty)
  .patch(propertyController.updateProperty)
  .delete(propertyController.deleteProperty);
module.exports = router;
