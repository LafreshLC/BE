//@ts-nocheck

import Order from "#/models/order";
import { RequestHandler } from "express";

export const orderDetails: RequestHandler = async(req, res)=>{
    const { products, address, mobile, totalPrice} = req.body
    const userId = req.user.id;
    const order = new Order({products, userId: userId, address, mobile, totalPrice});
    
    order.save();

    res.json({message: order}) 
}