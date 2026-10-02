const jwt=require("jsonwebtoken");
const User=require("../models/user")
const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("token is not found");
        }
        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET || "DevTinder");
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("user not found");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send("Invalid or expired token");
    }
};
module.exports={userAuth};