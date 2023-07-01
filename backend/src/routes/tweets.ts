import express from "express";
import * as TweetsController from "../controllers/tweets";

const router = express.Router();

router.post("/", TweetsController.createTweet);
router.patch("/:tweetId", TweetsController.updateTweet);
router.delete("/:tweetId", TweetsController.deleteTweet);
router.get("/timeline", TweetsController.timeline);
router.get("/", TweetsController.getUserTweets);

export default router;
