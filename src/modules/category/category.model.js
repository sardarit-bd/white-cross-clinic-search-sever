import { model, Schema } from "mongoose";
import slugify from "slugify";

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    immutable: true // slug cannot be updated
  },
  description: {
    type: String
  },
  thumbnail: {
    type: String
  }
}, {
  timestamps: true,
  versionKey: false
});

// Automatically generate slug from name before save
categorySchema.pre("save", function(next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
//   next();
});

const subcategorySchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    immutable: true
  }
}, {
  timestamps: true,
  versionKey: false
});

subcategorySchema.pre("save", function(next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
//   next();
});

export const Category = model("Category", categorySchema);
export const SubCategory = model("SubCategory", subcategorySchema);
