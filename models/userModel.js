const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { default: isEmail } = require("validator/lib/isEmail");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "User must have an email"],
    validate: {
      validator: isEmail,
      message: "Insert a valid email",
    },
    unique: true,
  },
  name: {
    type: String,
    required: [true, "User must have a name"],
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    minLength: [8, "Password must be longer than 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (val) {
        return val === this.password; // Compare with password
      },
      message: "Passwords must match",
    },
  },
  address: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
    description: String,
  },
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // Clear passwordConfirm after hashing
  next();
});

userSchema.methods.passwordCorrect = (candidatePassword, userPassword) => {
  return bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
// 6.2.1 User Model
// •	id: Unique identifier for the user./
// •	email: User's email address (unique)/.
// •	username: User's username (unique)./
// •	password: User's password (hashed).
// •	phonenumber: User's phone number (unique).
// •	address: User's address.
// •	avatar: URL to the user's avatar image (optional).
// •	createdAt: Timestamp when the user was created.
// •	posts: A list of posts created by the user.
// •	savedPosts: A list of posts saved by the user.
// •	chats: A list of chat IDs the user is involved in.