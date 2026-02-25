import mongoose from "mongoose";
import slugify from "slugify";

const { Schema } = mongoose;


const TestSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    sampleReqs: {
      type: String,
      default: "",
    },
    turnaround: {
      type: String,
      default: "",
    },
    specialInstructions: {
      type: String,
      default: "",
    },
     note: {
      type: String,
      default: "",
    },
    selfCollectKit: {
      type: String,
      default: "",
    },
    sampleGuide: [
      {
        code: { type: String, default: "" },
        value: { type: String, default: "" },
      },
    ],
    profileDetails: [
      {
        type: String,
        default: "",
      },
    ],
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  },
  { timestamps: true }
);

// Pre-save middleware to generate slug from title
TestSchema.pre("save", function () {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

const Test = mongoose.model("Test", TestSchema);
export default Test
