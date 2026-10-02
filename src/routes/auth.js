const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validations");

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

const toSafeUser = (user) => {
  const { password, ...safeUser } = user.toObject();
  return safeUser;
};

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      ...cookieOptions,
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ data: toSafeUser(savedUser) });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      ...cookieOptions,
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.send(toSafeUser(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", "", {
    ...cookieOptions,
    expires: new Date(0),
  });
  res.send("logout");
});

module.exports = { authRouter };