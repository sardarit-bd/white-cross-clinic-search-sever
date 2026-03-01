import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

const doctorAppointment = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now()
    },
    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },

    confirmed: {
      type: Boolean,
      default: false
    },
    shift: {
      type: String,
      enum: ["morning", "evening", "night"],
      default: "morning",
    },

    from: {
      type: String,
      required: true,
    },

    to: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      trim: true,
    },
    price: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

export const DoctorAppointment = model("DoctorAppointment", doctorAppointment);

