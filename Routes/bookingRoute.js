const express = require("express");
const authController = require("../controllers/authController");
const bookingController = require("./../controllers/bookingController");
const router = express.Router();

router.use(authController.protect);
router
  .route("/")
  .get(authController.restrictTo("admin"), bookingController.getBookings)
  .post(bookingController.addCurrentUser, bookingController.createBooking);
router
  .route("/myBooking")
  .get(bookingController.getBookingForOwner, bookingController.getBookings);
// router.use(authController.restrictTo("admin"));
router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateOnlyStatus, bookingController.updateBooking)
  .delete(bookingController.deleteBooking);
module.exports = router;
