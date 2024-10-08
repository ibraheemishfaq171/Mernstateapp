import User from "../models/user.model.js";
import errorHandler from "../utils/error.js";

import Listing from "../models/listing.model.js";

import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "Hello json controller",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return errorHandler(401, "You can update your own account");
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updateusers = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateusers._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return errorHandler(401, "You can delete your own account");
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      debugger;
      const listings = await Listing.find({ userRef: req.params.id });

      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User Not Found"));
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
