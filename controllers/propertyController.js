const catchAsync = require("./../Utils/catchAsync");
const Property = require("./../models/propertyModel");
const APIFeatures = require("./../Utils/apiFeatures");
exports.getTopFive = (req, res, next) => {
  req.query = {
    sort: "price",
    limit: 4,
  };
  next();
};
exports.getAllProperty = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Property.find(), req.query)
    .filter()
    .sort()
    .limitField()
    .paginate();
  const properties = await features.query;
  res.status(201).json({
    status: "success",
    result: properties.length,
    data: {
      properties,
    },
  });
});
exports.getProperty = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const property = await Property.findById(id).populate("reviews");
  res.status(201).json({
    status: "success",
    data: {
      property,
    },
  });
});
exports.createProperty = catchAsync(async (req, res, next) => {
  const property = await Property.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      property,
    },
  });
});

exports.updateProperty = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const property = await Property.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      property,
    },
  });
});
exports.deleteProperty = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const property = await Property.findByIdAndDelete(id);
  res.status(204).json({
    status: "success",
  });
});
