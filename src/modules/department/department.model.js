import { model, Schema } from "mongoose";
import slugify from "slugify";

// Main Department Schema
const departmentSchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true, immutable: true },
  intro: { type: String, default: "" },
  description: { type: String, default: "" },
  image: { type: String, default: "" }, // can be URL or file path
}, { timestamps: true, versionKey: false });

departmentSchema.pre("save", function(next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Sub Department Schema
const subDepartmentSchema = new Schema({
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: [true, "Department ID is required"]
  },
  name: { type: String, required: true },
  slug: { type: String, unique: true, immutable: true }
}, { timestamps: true, versionKey: false });

subDepartmentSchema.pre("save", function(next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Department = model("Department", departmentSchema);
export const SubDepartment = model("SubDepartment", subDepartmentSchema);
