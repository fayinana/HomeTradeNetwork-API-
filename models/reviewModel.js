const mongoose = require("mongoose");
const Property = require("./propertyModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty"],
    },
    rating: {
      type: Number,
      default: 4.5,
      required: [true, "Review must have a rating"],
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    property: {
      type: mongoose.Schema.ObjectId,
      ref: "Property",
      required: [true, "Review must belong to Property"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to User"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.index({ property: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function () {
  this.populate([{ path: "user", select: "name photo" }]);
});

reviewSchema.statics.calcAverageRating = async function (propertyId) {
  const stats = await this.aggregate([
    {
      $match: { property: propertyId },
    },
    {
      $group: {
        _id: "$property",
        nRating: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Property.findByIdAndUpdate(propertyId, {
      ratingsAverage: stats[0].averageRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Property.findByIdAndUpdate(propertyId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.property);
});

// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   this.r = await this.findOne();
//   console.log(this.r);
//   next();
// });

// reviewSchema.post(/^findOneAnd/, async function () {
//   await this.r.constructor.calcAverageRating(this.r.property);
// });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
