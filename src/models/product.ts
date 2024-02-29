import { Model, ObjectId, Schema, model } from "mongoose";

export interface ProductDocument {
  _id: ObjectId;
  name: string;
  category: ObjectId;
  price: Number;
  image: {
    url: string;
  };
  description: string;
  status: "available" | "unavailable";
}

const ImageSchema = new Schema({
  url: String,
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
  image: ImageSchema, // Using the ImageSchema for better definition

  description:{
    type: String,
    required: true,
  },
  status:{
    type: String,
    default: "available"
  }
}, 
{ timestamps: true });

export default model("Product", productSchema) as Model<ProductDocument>;
