import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import TweetModel from "../models/tweet";
import UserModel from "../models/user";
import { assertIsDefined } from "../util/index";

interface CreateTweetBody {
  username?: string;
  tweet?: string;
}

export const createTweet: RequestHandler<
  unknown,
  unknown,
  CreateTweetBody,
  unknown
> = async (req, res, next) => {
  const author = req.body.username;
  const content = req.body.tweet;

  try {
    assertIsDefined(author);
    if (!author || !content) {
      throw createHttpError(400, "Parameters missing");
    }

    const newTweet = await TweetModel.create({
      author: author,
      content: content,
      timestamp: new Date(),
    });

    return res.json(newTweet);
  } catch (error) {
    next(error);
  }
};

interface UpdateTweetParams {
  tweetId: string;
}

interface UpdateTweetBody {
  tweet?: string;
  username?: string;
}

export const updateTweet: RequestHandler<
  UpdateTweetParams,
  unknown,
  UpdateTweetBody,
  unknown
> = async (req, res, next) => {
  const tweetId = req.params.tweetId;
  const newTweet = req.body.tweet;
  const author = req.body.username;

  try {
    assertIsDefined(author);

    if (!mongoose.isValidObjectId(tweetId)) {
      throw createHttpError(400, "Invalid tweet id");
    }

    if (!newTweet) {
      throw createHttpError(400, "Tweet must have a body");
    }

    const tweet = await TweetModel.findById(tweetId).exec();

    if (!tweet) {
      throw createHttpError(404, "Tweet not found");
    }

    if (tweet.author !== author) {
      throw createHttpError(403, "You are not the author of this tweet");
    }

    tweet.content = newTweet;

    const updatedNote = await tweet.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteTweet: RequestHandler = async (req, res, next) => {
  const tweetId = req.params.tweetId;
  const author = req.body.username;

  try {
    assertIsDefined(author);

    if (!mongoose.isValidObjectId(tweetId)) {
      throw createHttpError(400, "Invalid tweet id");
    }

    const tweet = await TweetModel.findById(tweetId).exec();

    if (!tweet) {
      throw createHttpError(404, "tweet not found");
    }

    if (tweet.author !== author) {
      throw createHttpError(403, "You are not the author of this tweet");
    }

    await tweet.remove();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

interface TimelineBody {
  username?: string;
}

export const timeline: RequestHandler<
  unknown,
  unknown,
  TimelineBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;

  try {
    assertIsDefined(username);

    const user = await UserModel.findOne({ username: username })
      .select("+following")
      .exec();

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const followingUsers = user.following;

    const following = await UserModel.find({ _id: { $in: followingUsers } })
      .select("+following")
      .exec();

    const followingUsernames = following.map((user) => user.username);

    const tweets = await TweetModel.find({
      author: { $in: followingUsernames },
    })
      .sort({ timestamp: -1 })
      .exec();

    res.json(tweets);
  } catch (error) {
    next(error);
  }
};

export const getUserTweets: RequestHandler<
  unknown,
  unknown,
  TimelineBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;

  try {
    assertIsDefined(username);

    const tweets = await TweetModel.find({ author: username })
      .sort({ timestamp: -1 })
      .exec();

    res.json(tweets);
  } catch (error) {
    next(error);
  }
};
