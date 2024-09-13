const Review = require("./../models/reviewModel");
const catchAsync = require("./../Utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    result: reviews.length,
    data: {
      reviews,
    },
  });
});
exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const doc = await Review.findByIdAndDelete(req.params.id);
  if (!doc)
    return next(new AppError("Invalid ID no document found with that Id", 404));
  res.status(204).json({
    status: "success",
    data: null,
  });
});
