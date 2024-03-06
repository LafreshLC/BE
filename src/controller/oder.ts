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

export const userOrder: RequestHandler = async(req, res) => {
    const userId = req.user.id;
    const orders = await Order.find({userId: userId});
    res.json({orders});
}

export const pendingOrders: RequestHandler = async(req, res) => {
    const orders = await Order.find({status: "pending"});
    res.json({orders});
}

export const confirmedOrders: RequestHandler = async(req, res) =>{
    const orders = await Order.find({status: 'confirmed'});
    res.json({orders});
}