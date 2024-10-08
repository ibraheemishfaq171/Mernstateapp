import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import errorHandler from "../utils/error.js";

export const signup = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  const hashpassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashpassword });

  try {
    await newUser.save();
    res.status(201).json("User created suceessfully");
  } catch (error) {
    //   catch (err) {
    //     res.status(500).json(err.message);
    //   }
    // next(errorHandler(550, "Internal server error")
    // next(error);
    next(errorHandler(550, "Username or Email already Exist"));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validateuser = await User.findOne({ email });
    if (!validateuser) return next(errorHandler(400, "Not Found any user"));
    const valiadtepassword = bcryptjs.compareSync(
      password,
      validateuser.password
    );
    if (!valiadtepassword) return next(errorHandler(401, "Wrong password"));
    const token = jwt.sign({ id: validateuser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validateuser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
///
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedpassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashpassword = bcryptjs.hashSync(generatedpassword, 10);
      const newUser = new User({
        username: req.body.name,
        email: req.body.email,
        password: hashpassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
export const signOut = (req, res, next) => {
  try {
    res.clearCookie("access_token");

    res.status(200).json("user has been logged out");
  } catch (error) {
    next(error);
  }
};
