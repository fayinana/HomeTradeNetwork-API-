const factory = require("./handlerFactory");
const Booking = require("./../models/bookingModel");
const Property = require("../models/propertyModel");

exports.addCurrentUser = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
exports.getFiveBookings = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-createdAt";
  next();
};
exports.getBookingForOwner = (req, res, next) => {
  if (!req.user)
    return next("you don`t gave a permeation to perform this action", 401);
  (req.query.user = req.user._id), next();
};
exports.updateOnlyStatus = (req, res, next) => {
  req.body = { state: req.body.state };

  next();
};
exports.getBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
