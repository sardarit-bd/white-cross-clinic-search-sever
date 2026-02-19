import { model, Schema } from "mongoose";
import slugify from "slugify";

const newsSchema = new Schema({
    title: { type: String, required: true },
    image: { type: String, default: "" },
    tags: { type: String },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category ID is required"]
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        required: [true, "Subcategory ID is required"]
    },
    description: {
        type: String
    },

    createdDate: { type: Date, default: Date.now },

    slug: { type: String, unique: true, immutable: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },
}, { timestamps: true, versionKey: false });

// Generate slug from title
newsSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
});

export const News = model("News", newsSchema);
