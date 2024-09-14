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
  .get(
    propertyController.isActive,
    propertyController.hiddenDocuments,
    propertyController.getAllProperty
  )
  .post(propertyController.addOwner, propertyController.createProperty);

router
  .route("/allProperties")
  .get(authController.restrictTo("admin"), propertyController.getAllProperty);

router.route(
  "/inActiveProduct",
  propertyController.inActive,
  propertyController.getAllProperty
);
router
  .route("/myProperty")
  .get(
    propertyController.getPropertyForOwner,
    propertyController.getAllProperty
  );

router
  .route("/:id")
  .get(
    propertyController.isActive,
    propertyController.hiddenDocuments,
    propertyController.getProperty
  );

router
  .route("/allProperties/:id")
  .get(authController.restrictTo("admin"), propertyController.getProperty)
  .patch(authController.restrictTo("admin"), propertyController.updateProperty)
  .delete(
    authController.restrictTo("admin"),
    propertyController.deleteMyProperty
  );

router
  .route("/myProperty/:id")
  .get(propertyController.getPropertyForOwner, propertyController.getProperty)
  .delete(propertyController.deleteMyProperty)
  .patch(propertyController.updateMyProperty);

module.exports = router;
