import { Model, ObjectId, Schema, model } from "mongoose";

export interface ProductDocument {
  _id: ObjectId;
  name: string;
  category: ObjectId;
  variant: string[]; // Corrected typo from "varient" to "variant"
  available: boolean;
  image: {
    url: string;
    publicId: string;
  };
}

const ImageSchema = new Schema({
  url: String,
  publicId: String,
});

const VariantSchema = new Schema({
  name: String,
  price: Number,
  availability: { type: Boolean, default: true },
});

const productSchema = new Schema<ProductDocument>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  },
  variant: [VariantSchema], // Corrected typo from "varient" to "variant"
  available: {
    type: Boolean,
    default: true,
  },
  image: ImageSchema, // Using the ImageSchema for better definition
}, { timestamps: true });

export default model("Product", productSchema) as Model<ProductDocument>;
