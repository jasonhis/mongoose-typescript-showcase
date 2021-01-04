import mongoose from "mongoose";

import { UserDocLean } from "./user.model";

export interface PostPoJo {
  name: string;
  createdAt?: Date;

  // populate
  user: mongoose.Types.ObjectId | UserDocLean;
}

export interface PostDoc extends PostPoJo, mongoose.Document {}

type PostModel = mongoose.Model<PostDoc>;

export type PostDocLean = mongoose.LeanDocument<PostDoc>;

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    usePushEach: true,
  }
);

export default mongoose.model<PostDoc, PostModel>("Post", postSchema);
