
// @ts-nocheck
import { CreateUser, UserType } from "#/@types/user";
import { RequestHandler } from "express";
import User, { UserDocument } from '#/models/user';
import passwordResetToken from "#/models/passwordResetToken";
import crypto from "crypto";
import { PASSWORD_RESET_LINK } from "#/utils/variables";
import { sendForgetPasswordLink } from "#/utils/mail";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "#/utils/variables";


export const create: RequestHandler = async(req: CreateUser, res)=>{
   
    const {email, password, name} = req.body;
     
    const oldUser = await User.findOne({email})
    
    if(oldUser) return res.status(403).json({error: "Email already exist!"})
    
    const user = await User.create({name, email, password}); 
    res.status(201).json({user: {id: user._id, name, email} });

}

export const generateForgetPasswordLink: RequestHandler = async(req, res)=>{
   
    const { email } = req.body;
    
   const user = await User.findOne({email})
   if(!user) return res.status(404).json({error: "Account not found!"})

  //  generate the link if the email exist 
  await passwordResetToken.findOneAndDelete({
    owner: user._id,
  }); 

const token = crypto.randomBytes(36).toString('hex')

  await passwordResetToken.create({
    owner: user._id,
    token,
  })

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`

  sendForgetPasswordLink({ email:user.email, link:resetLink });

  res.json({ message: "Check your registered mail" });
  }

  export const isValidPasswordResetToken: RequestHandler = async(req, res)=>{
    const { token, userId } = req.body;

   const resetToken = await passwordResetToken.findOne({owner: userId})
   if(!resetToken) return res.status(403).json({error: "Unauthorized acccess, invalid token"});

   const matched = await resetToken.compareToken(token)
   if(!matched) return res.status(403).json({error: "Unauthorized acccess, invalid token"});
  
   res.json({ message: "your token is valid."})
}

  export const grantValid: RequestHandler = async(req, res)=>{
      res.json({valid: true});
   }

   export const updatePassword: RequestHandler = async(req, res)=>{
    const {password, userId} = req.body
    const user = await User.findById(userId)
    if(!user) return res.status(403).json({error: "Unathorized access!"}) 
  
    const matched = await user.comparePassword(password)
    if(matched) return res.status(422).json({error: "The new password must be diffrent!"})
  
    user.password = password
    await user.save() 
  
    await passwordResetToken.findOneAndDelete({owner: user._id});
    // send success mail
    res.json({message: "Password Reset successfully."})
  };

  export const signIn: RequestHandler = async (req, res) => {
    const { password, email } = req.body;
  
    const user = await User.findOne({
      email,
    });
    if (!user) return res.status(403).json({ error: "Email/Password mismatch!" });
  
    // compare the password
    const matched = await user.comparePassword(password);
    if (!matched)
      return res.status(403).json({ error: "Email/Password mismatch!" });
  
    // generate the token for later use.
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    user.token = token;
  
    await user.save(); 
  
    res.json({
      profile: {
        id: user._id,
        name: user.name,
        email: user.email, 
        address: user.address,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  };

  export const updateProfile: RequestHandler = async (req, res)=>{
    const {userId} = req.params;
    const {address, phone} = req.body;
    const user = await User.findByIdAndUpdate(userId, {address, phone});
    if(!user) return res.status(400).json({message: "Something went wrong!"});
    res.json({user: {address, phone}});
  }

  export const sendProfile: RequestHandler = async (req, res) =>{
    const {userId} = req.params;
    const user = await User.findById(userId).select("-password");
    if(!user) return res.status(400).json({message: "Something went wrong!"});
    res.json({ profile: user });  
  } 


export const logout: RequestHandler = async (req, res) => {
  // logout and remove the entire token field
  const user = await User.findById(req.user.id);

  if (!user) throw new Error("Something went wrong, user not found!");

  // remove the entire token field
  user.token = ''; 

  await user.save();
  res.json({ success: true });
};

  
