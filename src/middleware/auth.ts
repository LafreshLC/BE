//@ts-nocheck

import passwordResetToken from "#/models/passwordResetToken";
import User from "#/models/user";
import { JWT_SECRET } from "#/utils/variables";
import { JwtPayload, verify } from "jsonwebtoken";
import { RequestHandler } from "express";

export const isValidPasswordResetToken: RequestHandler = async(req, res, next)=>{
   
    const { token, userId } = req.body;

   const resetToken = await passwordResetToken.findOne({owner: userId})
   if(!resetToken) return res.status(403).json({error: "Unauthorized acccess, invalid token"});

   const matched = await resetToken.compareToken(token)
   if(!matched) return res.status(403).json({error: "Unauthorized acccess, invalid token"});
    
   next()
}

export const mustAuth: RequestHandler = async(req, res, next)=>{
    const {authorization} = req.headers;

    const token = authorization?.split("Bearer ")[1];

    if(!token) return res.status(403).json({error: "Unauthorized request"});
    const payload = verify(token, JWT_SECRET) as JwtPayload;
    const id = payload.userId;
    const user = await User.findOne({_id: id, token: token});
    if(!user) return res.status(403).json({error: "Unauthoried request! "});
     
    req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },    
      
      req.token = token;

    next()
};