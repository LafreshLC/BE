import {model, Schema, ObjectId, Model} from "mongoose";

export interface ComboDocument {
    _id: ObjectId;
    name: String;
    price: Number;
    product:ObjectId[];
    description: String;
    image: {
        url: string;
      };
    }

const comboSchema = new Schema<ComboDocument>({
    name: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    product: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }],
    description:{ 
        type: String,
    },
    image: {
        type: Object,
        url: String,
    }
}, {timestamps: true});

export default model("Combo", comboSchema) as Model<ComboDocument>;