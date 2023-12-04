import User from "../Models/Registration.js";
import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  let token;
  if (req.headers?.token?.startsWith("Bearer")) {
    token = req.headers.token.split(" ")[1];
    try {
      if (token) {
        const string = jwt.verify(token, process.env.JWT_CODE);
        const user = await User.findById(string.id);
        req.user = user;
      }
      next();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(400).json({ msg: "There is no authorization token" });
  }
};
