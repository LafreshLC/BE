import { Model, ObjectId, Schema, model } from "mongoose";

export interface ProductDocument {
  _id: ObjectId;
  name: string;
  category: ObjectId;
  price: Number;
  variant: string[]; // Corrected typo from "varient" to "variant"
  image: {
    url: string;
  };
  description: string
}

const ImageSchema = new Schema({
  url: String,
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
  price:{
    type: Number,
    required: true
  },
  variant: [VariantSchema], // Corrected typo from "varient" to "variant"
  
  image: ImageSchema, // Using the ImageSchema for better definition

  description:{
    type: String,
    required: true,
  }
}, 
{ timestamps: true });

export default model("Product", productSchema) as Model<ProductDocument>;
