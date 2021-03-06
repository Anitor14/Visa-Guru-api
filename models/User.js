const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    minlength: 3,
    maxlength: 50,
  },

  email: {
    type: String,
    unique: true,
    required: [true, "please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: 8,
    select: false,
  },
  // passwordConfirm: {
  //   type: String,
  //   required: [true, "please confirm your password"],
  //   validate: {
  //     // This only works on CREATE and SAVE!!.
  //     validator: function (el) {
  //       return el === this.password;
  //     },
  //     message: "passwords are not the same!",
  //   },
  // },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  // Only run this function if password was actually modified.
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

// UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
//   if (this.passwordChangedAt) {}
// };

module.exports = mongoose.model("User", UserSchema);
