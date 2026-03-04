import mongoose from "mongoose";
import { gender, role } from "../../Common/Enums/index.js";
import { hashing } from "../../index.js";

const phoneSchema = new mongoose.Schema({
  iv: { type: String, required: true },
  data: { type: String, required: true },
});

const usersModelSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9,_+-]+@(gmail|yahoo|outlook|hotmail)\.(com|net)(\.edu|\.eg)?$/,
        "Email must be a valid email with valid providers only",
      ],
    },
    password: {
      type: String,
      minlength: 8,
      required: true,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{8,24}$/,
        "Password must be 8-24 chars with at least one uppercase, one lowercase, one number, and one special character",
      ],
    },
    picture: { type: String, default: null },
    gender: {
      type: String,
      enum: [gender.Male, gender.Female],
      default: gender.Male,
    },
    role: {
      type: String,
      enum: [role.User, role.Admin],
      default: role.User,
    },
    DOB: { type: Date },
    BIO: { type: String },
    phone: {
      type: [phoneSchema],
      default: [],
      validate: {
        validator: (val) => val.length <= 2,
        message: "A user can have at most 2 phone numbers.",
      },
    },
    logOut: { type: Date },
    termsAgreement: { type: Boolean, default: false },
    visitors: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users",
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isWarned: {
      type: Boolean,
      default: false, 
    },
    forgetPassword: {
      type: String,
    },
  },
  {
    optimisticConcurrency: true,
    collection: "Users",
    timestamps: true,
  },
);

usersModelSchema.virtual("userName").get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});


usersModelSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await hashing(this.password);
});


usersModelSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (update.$set && update.$set.password) {
    update.$set.password = await hashing(update.$set.password);
  }
});

export const usersModel =
  mongoose.models.Users || mongoose.model("Users", usersModelSchema);