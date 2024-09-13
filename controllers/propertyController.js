const Property = require("./../models/propertyModel");
const factory = require("./handlerFactory");
exports.getTopFive = (req, res, next) => {
  req.query = {
    sort: "price",
    limit: 4,
  };
  next();
};
exports.getAllProperty = factory.getAll(Property);
exports.getProperty = factory.getOne(Property, { path: "reviews" });
exports.createProperty = factory.createOne(Property);
exports.updateProperty = factory.updateOne(Property);
exports.deleteProperty = factory.deleteOne(Property);

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
