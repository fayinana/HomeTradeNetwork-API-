const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const Property = require("./../models/propertyModel");
const factory = require("./handlerFactory");
exports.getTopFive = (req, res, next) => {
  req.query.sort = "price";
  req.query.limit = 4;
  next();
};
exports.isActive = (req, res, next) => {
  req.query.isActive = true;
  next();
};
exports.inActive = (req, res, next) => {
  req.query.isActive = false;
  next();
};
exports.hiddenDocuments = (req, res, next) => {
  req.query.fields = "title,price,isActive";
  next();
};

exports.getPropertyForOwner = (req, res, next) => {
  req.query = {
    owner: req.user._id,
  };
  next();
};
exports.addOwner = (req, res, next) => {
  req.body.owner = req.user._id;
  next();
};

exports.getAllProperty = factory.getAll(Property);
exports.getProperty = factory.getOne(Property, { path: "reviews" });
exports.createProperty = factory.createOne(Property);
exports.updateProperty = factory.updateOne(Property);
exports.deleteProperty = factory.deleteOne(Property);

exports.deleteMyProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findOneAndDelete({
    owner: req.user._id,
    _id: req.params.id,
  });
  if (!property)
    return next(
      new AppError("this property is not you or no property with this ID")
    );
  res.status(204).json({
    status: "success",
  });
});
exports.updateMyProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findOneAndUpdate(
    {
      owner: req.user._id,
      _id: req.params.id,
    },
    req.body,
    { new: true, runValidators: true }
  );
  if (!property)
    return next(
      new AppError("this property is not you or no property with this ID")
    );
  res.status(200).json({
    status: "success",
    data: {
      property,
    },
  });
});

// exports.typeStats = async (req, res, next) => {
//   const stats = await Property.aggregate([
//     {
//       $group: {
//         _id: "$propertyType",
//         numProperty: { $sum: 1 },
//       },
//     },
//   ]);

//   res.status(200).json({
//     status: "success",
//     data: {
//       stats,
//     },
//   });
// };
