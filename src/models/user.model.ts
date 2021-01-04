import mongoose from "mongoose";

// an interface that return to the API's client
// internal properties like _id shouldn't be exposed here
export interface UserDocPublic {
  phoneNumber: string;
  uid: string;
}

export enum UserDocSource {
  firebase = 0,
}

// a plain object representing the schema
// this is identical to the schema we put into mongoose.Schema
// be aware that _id is not defined here
export interface UserPoJo {
  uid: string;
  phoneNumber: string;
  source: UserDocSource;
  createdAt?: Date;
}

// a Document object representing the real mongoose.Document
// it has _id, and all the functions of the document like save() and update()
export interface UserDoc extends UserPoJo, mongoose.Document {}

// the real model object which has all the query and create function
interface UserModel extends mongoose.Model<UserDoc> {
  // static methods go here if there is any
  findFirstUser(): UserDocLean;
}

// a lean() plain object for the UserDoc
// this is returned when you invoke `UserModel.find({...}).lean()`
// the difference of this and UserPoJo is that it has the _id property
export type UserDocLean = mongoose.LeanDocument<UserDoc>;

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      unique: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: Number,
      enum: [0],
      default: 0,
    },
  },
  {
    usePushEach: true,
  }
);

userSchema.index({ username: 1 }, { source: true, uid: true });

userSchema.statics.findFirstUser = async function (this: UserModel) {
  return await this.findOne().lean();
};

export const userModelHelper = {
  toPublic(userPojo: UserPoJo): UserDocPublic {
    return {
      phoneNumber: userPojo.phoneNumber,
      uid: userPojo.uid,
    };
  },
};

export default mongoose.model<UserDoc, UserModel>("User", userSchema);
