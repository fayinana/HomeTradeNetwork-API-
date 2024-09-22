const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const Property = require("./../models/propertyModel");
const factory = require("./handlerFactory");

const { default: axios } = require("axios");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("not an image! please upload only image "), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPropertyPhoto = upload.single("imageCover");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_API_URL = process.env.GITHUB_API_URL.replace(
  "<GITHUB_REPO>",
  GITHUB_REPO
);

exports.resizePropertyPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const filename = `property-${req.user._id}-${Date.now()}.jpeg`;
  const buffer = await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();
  const response = await axios.put(
    `${GITHUB_API_URL}property/${filename}`,
    {
      message: `Upload photo ${filename}`,
      content: buffer.toString("base64"),
    },
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status !== 201) {
    return next(new AppError("Failed to upload image to GitHub", 500));
  }
  req.file.filename = filename;
  next();
});

exports.getTopFive = (req, res, next) => {
  req.query.sort = "price";
  req.query.limit = 4;
  next();
};
exports.getLatestFiveProperty = (req, res, next) => {
  req.query.sort = "-createdAt";
  req.query.limit = 5;
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
    "title,price,isActive,imageCover,discount,location,type,propertyType,ratingsAverage,ratingsQuantity,area";
  next();
};

exports.getPropertyForOwner = (req, res, next) => {
  if (!req.user)
    return next("you don`t gave a permeation to perform this action", 401);

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
  const githubURL =
    "https://raw.githubusercontent.com/fayinana/HomeTradeNetwork-API-/refs/heads/main/file/image/property/";
  if (req.file) req.body.imageCover = `${githubURL}${req.file.filename}`;

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

exports.typeStats = async (req, res, next) => {
  const stats = await Property.aggregate([
    {
      $group: {
        _id: "$type",
        numProperty: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
};
exports.propertyTypeStats = async (req, res, next) => {
  const stats = await Property.aggregate([
    {
      $group: {
        _id: "$propertyType",
        numProperty: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
};
