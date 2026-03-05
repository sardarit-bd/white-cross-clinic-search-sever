import mongoose from "mongoose";
import slugify from "slugify";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const { Schema } = mongoose;

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true
    },

    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    amount: {
      type: Number,
      default: 0, 
      min: 0,
    },

    expireDate: {
      type: Date,
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);


const Coupon = mongoose.model("Coupon", CouponSchema);

export default Coupon;
