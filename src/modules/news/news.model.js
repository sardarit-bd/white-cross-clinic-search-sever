import { model, Schema } from "mongoose";
import slugify from "slugify";

const newsSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, immutable: true },
    createdDate: { type: Date, default: Date.now },
    image: { type: String, default: "" },
    tags: [{ type: String }],
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category ID is required"]
    },
    subCategoryId: {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        required: [true, "Subcategory ID is required"]
    },
    userName: { type: String, required: true },
    userProfile: { type: String }
}, { timestamps: true, versionKey: false });

// Generate slug from title
newsSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

export const News = model("News", newsSchema);
