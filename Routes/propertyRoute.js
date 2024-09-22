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

router.get(
  "/inActiveProperty",
  // authController.restrictTo("admin"),
  propertyController.inActive,
  propertyController.getAllProperty
);
router.get(
  "/latestFiveProperty",
  authController.restrictTo("admin"),
  propertyController.getLatestFiveProperty,
  propertyController.getAllProperty
);

router.get("/propertyByType", propertyController.typeStats);
router.get("/propertyByPropertyType", propertyController.propertyTypeStats);
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
  .patch(
    authController.restrictTo("admin"),
    propertyController.activateProperty,
    propertyController.updateProperty
  )
  .delete(
    authController.restrictTo("admin"),
    propertyController.deleteProperty
  );

router
  .route("/myProperty/:id")
  .get(propertyController.getPropertyForOwner, propertyController.getProperty)
  .delete(propertyController.deleteMyProperty)
  .patch(
    propertyController.uploadPropertyPhoto,
    propertyController.resizePropertyPhoto,
    propertyController.updateMyProperty
  );

module.exports = router;
