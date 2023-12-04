import express from "express";
import crypto from "crypto";
import User from "../Models/Registration.js";
import jwt from "jsonwebtoken";
import emailCheck from "../Middlewares/emailCheck.js";
import Leads from "../Models/Leads.js";
import { sendMail } from "../utils/sendMail.js";
import authMiddleware from "../Middlewares/authMiddleware.js";
import { roleCheck } from "../Middlewares/roleCheck.js";

const router = express.Router();
const saltRounds = 10;

// Route 1: Create a new admin using post "/registration". No login required.
router.post("/registration", emailCheck, async (req, res) => {
  User.create(req.body)
    .then(() => {
      res.status(201).json({ msg: "User Added Successfully" });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Route2: Login an existing user with password and email
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && (await user.isPasswordMatched(req.body.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_CODE, {
        expiresIn: "2h",
      });
      res.status(200).json({
        token: token,
        msg: "User Successfully logged in.",
      });
    } else {
      res.status(401).json({ msg: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Login with token
router.get("/login_with_token", authMiddleware, async (req, res) => {
  try {
    return res.status(200).json({ data: req.user });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// Get a user
router.get("/user/:id", authMiddleware, roleCheck, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-password");
    res.status(200).json({ data: user });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

// Generate Password Reset Token
router.post("/resetpassword", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ msg: "No user found" });
  }
  try {
    const token = await user.createPswrdRstToken();
    await user.save();
    const resetURL = `Hi ${user.first_name}, Please follow this link to reset your password. This link is valid till 10 minutes from now. <a href="https://zen-student-portfolio-client.vercel.app/resetpassword/${token}">Click Here</a>`;
    const data = {
      to: email,
      subject: "Password Reset",
      html: resetURL,
    };
    sendMail(data);
    res.status(200).json({ msg: "link send successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Reset Password
router.post("/resetPassword/:token", async (req, res) => {
  const password = req.body.password;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res
      .status(400)
      .json({ msg: "Reset Token expired, Please try again" });
  }
  user.password = password;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();
  res.json(user);
});

// Create new user
router.post("/new_user", authMiddleware, emailCheck, async (req, res) => {
  try {
    if (req.user.role == "manager") {
      const newUser = new User({
        ...req.body,
        admin: req.user.admin,
        manager: req.user._id,
      });
      await newUser.save();
      res.json({ msg: `${req.body.role} added successfully` });
    }
    if (req.user.role == "admin") {
      const newUser = new User({
        ...req.body,
        admin: req.user._id,
      });
      await newUser.save();
      res.json({ msg: `${req.body.role} added successfully` });
    }
  } catch (err) {
    console.log(err);
  }
});

//Delete a user
router.delete("/user/:id", authMiddleware, async (req, res) => {
  const user_id = req.params.id;
  const deleteUser = await User.findByIdAndDelete(user_id);
  res.json({
    msg: `${
      deleteUser?.first_name + " " + deleteUser?.last_name
    } deleted successfully`,
  });
});

//Get all users of an admin
router.get("/users", authMiddleware, async (req, res) => {
  try {
    if (req.user.role == "admin") {
      var users = await User.find({ role: ["manager", "employee"] }).populate(
        "admin manager"
      );
    } else {
      var users = await User.find({
        role: "employee",
        admin: req.user.admin,
      }).populate("admin manager");
    }
    if (users) {
      res.status(200).json({ data: users });
    } else {
      res.json({ msg: "No data found" });
    }
  } catch (err) {
    return res.json({ msg: err.message });
  }
});

// Update a user
router.put("/user/:id", authMiddleware, roleCheck, async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res
      .status(200)
      .json({ data: updatedUser, msg: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

//Get all manager of an admin
router.get("/managers", authMiddleware, async (req, res) => {
  try {
    const managers = await User.find({
      admin: [req.user.id, req.user?.admin],
      role: "manager",
    });
    res.status(200).json({ data: managers });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});


export default router;
