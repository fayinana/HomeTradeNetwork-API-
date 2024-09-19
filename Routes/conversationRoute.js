const express = require("express");
const conversationController = require("./../controllers/conversationController");
const authController = require("../controllers/authController");
const router = express.Router();
router.use(authController.protect);

router
  .route("/")
  .post(conversationController.createConversation)
  .get(conversationController.getConversation);
router.get("/find/:firstUserId/:secondUserId");

module.exports = router;
