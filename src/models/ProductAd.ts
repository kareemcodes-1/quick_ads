import mongoose, { Schema, model, Document, models } from "mongoose";

export interface ProductAd {
  description: string;
  imageBase64: string; // or URL if uploaded
  videoUrl?: string; // optional video link
  createdAt: Date;
  user: mongoose.Types.ObjectId;
  workspace: mongoose.Types.ObjectId;
}

export interface ProductAdDocument extends ProductAd, Document {}

const productAdSchema = new Schema<ProductAdDocument>(
  {
    description: { type: String, required: true },
    imageBase64: { type: String, required: true },
    videoUrl: { type: String, default: null }, // new field
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Export the model. Use existing model if it exists to avoid recompilation errors
export default models.ProductAd || model<ProductAdDocument>("ProductAd", productAdSchema);
