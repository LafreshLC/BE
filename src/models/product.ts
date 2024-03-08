import { Model, ObjectId, Schema, model } from "mongoose";

export interface ProductDocument {
  _id: ObjectId;
  name: string;
  category: ObjectId;
  price: Number;
  image: string;
  description: string;
  status: "available" | "unavailable";
}

// const ImageSchema = new Schema({
//   url: String,
// });

const productSchema = new Schema<ProductDocument>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  price:{
    type: Number,
    required: true
  },  
  image: {
    type: String,
  }
,
  description:{
    type: String,
  },
  status:{
    type: String,
    default: "available"
  }
}, 
{ timestamps: true });

export default model("Product", productSchema) as Model<ProductDocument>;
