const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const Property = require("./../models/propertyModel");
const factory = require("./handlerFactory");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("not an image! please upload only image "), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPropertyImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

exports.resizePropertyImages = catchAsync(async (req, res, next) => {
  const githubURL =
    "https://raw.githubusercontent.com/fayinana/HomeTradeNetwork-API-/main/file/image/property/";
  if (!req?.files?.images || !req?.files?.images) return next();
  const imageCoverFileName = `property-${
    req.params.id
  }-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`file/image/property/${imageCoverFileName}`);
  req.body.imageCover = `${githubURL}${imageCoverFileName}`;
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `property-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`file/image/property/${filename}`);
      req.body.images.push(`${githubURL}${filename}`);
    })
  );
  next();
});
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
  req.query.fields =
    "title,price,isActive,imageCover,discount,location,type,propertyType,ratingsAverage,ratingsQuantity";
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

exports.activateProperty = (req, res, next) => {
  req.body = { isActive: req.body.isActive };
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
