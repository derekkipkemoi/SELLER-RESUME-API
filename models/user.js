const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      // unique: true, ← DO NOT include this
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    packageId: {
      type: String,
      required: [true, "Package ID is required"],
    },
    packageName: {
      type: String,
      required: [true, "Package name is required"],
    },
    packagePrice: {
      type: String,
      required: [true, "Package price is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
