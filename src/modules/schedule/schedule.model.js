import mongoose from "mongoose";

const { Schema } = mongoose;

const doctorScheduleSchema = new Schema(
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
  },
  {
    timestamps: true, 
  }
);

export default mongoose.models.DoctorSchedule ||
  mongoose.model("DoctorSchedule", doctorScheduleSchema);
