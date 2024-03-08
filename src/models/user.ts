import { compare, hash } from "bcrypt";
import { Model, ObjectId, Schema, model } from "mongoose";

// creating interface 
export interface UserDocument {
    _id: ObjectId;
    name: string; 
    email: string;
    password:string;
    address:string;
    phone:string;
    token: string;
    role: "admin" | "user";
}

interface Methods {
    comparePassword(password: string): Promise<boolean>
}

const userSchema = new Schema<UserDocument, {}, Methods>({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    address:{
        type: String,
    },
    phone:{
        type: String,
    },
    role:{
        type: String,
        default: "user",
    },
    token: {
        type: String,
    } 
},{timestamps: true});

userSchema.pre('save', async function(next){
    // hash the token
    if(this.isModified("password")){ 
        this.password = await hash(this.password, 10); 
    }
    next(); 
}); 
 
userSchema.methods.comparePassword = async function(password){
 const result = await compare(password, this.password)
 return result
}


export default model("User", userSchema) as Model<UserDocument, {}, Methods>