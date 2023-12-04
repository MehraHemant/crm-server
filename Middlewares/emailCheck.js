import User from "../Models/Registration.js";

export default async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({msg:"User already exists"});
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
