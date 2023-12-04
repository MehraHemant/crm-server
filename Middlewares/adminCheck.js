import User from '../Models/Registration.js'
import jwt from 'jsonwebtoken'

export default async (req, res, next) => {
    let token;
    if (req.headers.token.startsWith("Bearer")) {
      token = req.headers.token.split(" ")[1];
    try {
        if (token) {
            const string = jwt.verify(token, process.env.JWT_CODE);
            req.user = string.id; 
        }
        const user = await User.findById(req.user);
        if (user.role === 'admin') {
            next();
        } else {
            return res.status(400).json({ error: 'Not Authorize to this function' })
        }
    } catch (error) {
        return res.status(500).json({error})
    }}else{
    res.status(400).json({ msg: "There is no authorization token" });

    }
}