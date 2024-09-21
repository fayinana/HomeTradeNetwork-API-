const mongoose = require("mongoose");
const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    summary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
      // validate: {
      //   validator: function (val) {
      //     console.log(val < this.price);
      //     console.log(val);
      //     console.log(this.price);
      //     return val < this.price;
      //   },
      //   message: "discount must be less than price",
      // },
    },
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      description: String,
    },
    type: {
      type: String,
      enum: ["rent", "sale"],
      required: true,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    propertyType: {
      type: String,
      enum: ["apartment", "house", "condominium", "land"],
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    imageCover: {
      type: String,
      require: true,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, "A property rating average have to be less than 5 "],
      min: [1, "A property rating average have to be grater than 1 "],
      set: function (val) {
        return Math.round(val * 10) / 10;
      },
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    area: {
      type: Number,
      required: [true, "area of property is required"],
    },
    // taxDocument: {
    //   type: String,
    // },
    // sitPlanDocument: {
    //   type: String,
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

propertySchema.virtual("reviews", {
  ref: "Review",
  foreignField: "property",
  localField: "_id",
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
