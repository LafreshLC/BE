//@ts-nocheck
import Order from "#/models/order";
import { RequestHandler } from "express";

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

export const allOders: RequestHandler = async(req, res) => {
    const totalOrders = await Order.countDocuments();
    res.json({totalOrders});
}

export const updateOrder: RequestHandler = async (req, res) =>{
    const {id, status} = req.body;
    const order = await Order.findByIdAndUpdate(id, {status: status}, {new: true});
    if(!order) return res.json({message : "Cannot update order!"});
    res.json({message: order});
}