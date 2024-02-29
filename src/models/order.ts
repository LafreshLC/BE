import { Model, model, ObjectId, Schema } from "mongoose";

export interface OrderDocument{
    _id: ObjectId;
    userId: ObjectId;
    products: [{productId: ObjectId, quantity: number}];
    address: String;
    totalPrice: number;
    mobile: number;
    status: "pending" | "processing" | "confirmed"
}

const orderSchema = new Schema<OrderDocument>({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    products:[{
        productId:{
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
        quantity:{
            type: Number
        }
    }],
    address:{
        type: String,
        required: true, 
    },
    totalPrice: {
        type: Number,
        required: true
    },
    mobile:{
        type: Number,
        required: true 
    },
    status:{
        type: String,
        default: "pending"
    }
});
export default model("Order", orderSchema) as Model<OrderDocument>