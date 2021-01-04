import PostModel from "./models/post.model";
import UserModel, { userModelHelper, UserDocLean, UserDocSource } from "./models/user.model";
import mongoose from "mongoose";

async function startMongoose() {
  const connStr = "mongodb://localhost:27017/ts";

  mongoose.Promise = global.Promise;
  await mongoose.connect(connStr, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  await mongoose.connection.db.dropDatabase();

  console.log("Connected to Database", connStr);
}

async function tryIt() {
  await startMongoose();

  let userDoc = await UserModel.create({
    uid: "my-uid",
    phoneNumber: "my-phonenumber",
    source: UserDocSource.firebase,
  });

  await PostModel.create({
    user: userDoc._id,
    name: "post-name",
  });

  // a simple find on UserModel will return you UserDoc
  userDoc = await UserModel.findOne();
  console.log("userDoc", userDoc);

  // the lean() function will return you UserDocLean
  const userDocLean = await UserModel.findOne().lean();
  console.log("userDocLean", userDocLean);

  const userDocPublic = userModelHelper.toPublic(userDocLean);
  console.log("userDocPublic", userDocPublic);

  // getting the postLean with user reference
  const postLean = await PostModel.findOne().populate("user").lean();

  console.log("my number", (postLean.user as UserDocLean).phoneNumber);

  // invoke static method in UserModel
  const firstUser = await UserModel.findFirstUser();
  console.log("firstuser", firstUser);
  console.log("My phone number", firstUser.phoneNumber);
}

tryIt();
