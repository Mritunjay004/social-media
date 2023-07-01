import { InferSchemaType, model, Schema } from "mongoose";

const tweetSchema = new Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

type Tweet = InferSchemaType<typeof tweetSchema>;

export default model<Tweet>("Tweet", tweetSchema);
