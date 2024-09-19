const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  property: {
    type: mongoose.Schema.ObjectId,
    ref: "Property",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  state: {
    type: String,
    default: "Applied",
    enum: ["Applied", "Pending", "Completed"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate([
    { path: "user", select: "email name photo phone" },
    {
      path: "property",
      select: "imageCover title",
    },
  ]);
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
