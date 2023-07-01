import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../util/index";
import mongoose from "mongoose";

interface SignUpBody {
  username?: string;
  password?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const passwordRaw = req.body.password;

  try {
    if (!username || !passwordRaw) {
      throw createHttpError(400, "Parameters missing");
    }

    const existingUsername = await UserModel.findOne({
      username: username,
    }).exec();

    if (existingUsername) {
      throw createHttpError(
        409,
        "Username already taken. Please choose a different one or log in instead."
      );
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await UserModel.create({
      username: username,
      password: passwordHashed,
      followers: [],
    });

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      env.SESSION_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ token: token });
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    const user = await UserModel.findOne({ username: username })
      .select("+password")
      .exec();

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      env.SESSION_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token: token });
  } catch (error) {
    next(error);
  }
};

interface FollowParams {
  userId?: string;
}

interface FollowBody {
  username?: string;
}

export const follow: RequestHandler<
  FollowParams,
  unknown,
  FollowBody,
  unknown
> = async (req, res, next) => {
  const userId = req.params.userId;
  const loggedInUsername = req.body.username;

  try {
    if (!userId || !loggedInUsername) {
      throw createHttpError(400, "Parameters missing");
    }

    const user = await UserModel.findOne({ username: loggedInUsername })
      .select("+following")
      .exec();

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const userIdObject = new mongoose.Types.ObjectId(userId);

    if (user.following.includes(userIdObject)) {
      throw createHttpError(401, "Already following user");
    }

    user.following.push(userIdObject);

    await user.save();

    res.status(200).json({ message: "Followed user successfully" });
  } catch (error) {
    next(error);
  }
};

interface UnfollowParams {
  userId?: string;
}

interface UnfollowBody {
  username?: string;
}

export const unfollow: RequestHandler<
  UnfollowParams,
  unknown,
  UnfollowBody,
  unknown
> = async (req, res, next) => {
  const userId = req.params.userId;
  const loggedInUsername = req.body.username;

  try {
    if (!userId || !loggedInUsername) {
      throw createHttpError(400, "Parameters missing");
    }

    const user = await UserModel.findOne({ username: loggedInUsername })
      .select("+following")
      .exec();

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const userIdObject = new mongoose.Types.ObjectId(userId);

    if (!user.following.includes(userIdObject)) {
      throw createHttpError(401, "Not following user");
    }

    user.following = user.following.filter(
      (followedUserId) => !followedUserId.equals(userIdObject)
    );

    await user.save();

    res.status(200).json({ message: "Unfollowed user successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await UserModel.find().exec();

    res.status(200).json({ users: users });
  } catch (error) {
    next(error);
  }
};
