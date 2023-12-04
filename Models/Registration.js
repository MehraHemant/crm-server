import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: Number,
    unique: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "admin",
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.createPswrdRstToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  console.log(this.passwordResetToken);
  return resetToken;
};

export default mongoose.model("user", userSchema);
