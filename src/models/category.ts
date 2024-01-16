import { Model, ObjectId, Schema, model } from "mongoose";

// creating interface 
export interface CatDocument {
    _id: ObjectId;
    name: string; 
}



const userSchema = new Schema<CatDocument>({
    name:{
        type: String,
        required: true,
        trim: true,
    }, 
},{timestamps: true});


export default model("Category", userSchema) as Model<CatDocument>