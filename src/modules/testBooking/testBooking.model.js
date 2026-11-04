import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

export const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

const testBookingSchema = new Schema(
  {
    bookingRef: { type: String, required: true, unique: true },

    test: { type: Schema.Types.ObjectId, ref: "Test", required: true },
    testTitle: { type: String, required: true },
    testSlug: { type: String, required: true },
    price: { type: Number, default: null },
    phlebotomyFee: { type: Number, default: null },

    // Stored as plain strings: date = YYYY-MM-DD, time = HH:mm (clinic time)
    date: { type: String, required: true },
    time: { type: String, required: true },

    firstName: { type: String, required: true, trim: true, maxlength: 60 },
    lastName: { type: String, required: true, trim: true, maxlength: 60 },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, enum: GENDERS, required: true },
    phone: { type: String, default: "", trim: true, maxlength: 30 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true, versionKey: false }
);

// One confirmed booking per slot
testBookingSchema.index(
  { date: 1, time: 1 },
  { unique: true, partialFilterExpression: { status: "confirmed" } }
);

export const TestBooking = model("TestBooking", testBookingSchema);