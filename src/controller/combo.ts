import { RequestHandler } from "express";
import Combo from "#/models/combo";
import { isValidObjectId } from "mongoose";


export const create: RequestHandler = async(req, res) =>{
    const {name, price, product, description, image} = req.body
    // if(!isValidObjectId(product)) return res.status(422).json({error: "Invalid product id!"})
    const combo = new Combo({
        name, 
        price, 
        product,
        description,
        image
    });
    await combo.save();
    res.json({combo: {name, price, product, description, image}});
}

export const updateCombo: RequestHandler = async(req, res) =>{
    const { name, product, price, description, image} = req.body;
    const {comboId} = req.params;
    if(!isValidObjectId(comboId)) return res.status(422).json({error: "Inavlid combo id!"});
    const combo = await Combo.findOneAndUpdate({_id: comboId}, {name, product, price, description, image});
    if(!combo) return res.status(422).json({error: "Combo not found!"});
    await combo.save();
    res.status(200).json({combo});
}

export const removeCombo: RequestHandler = async(req, res) =>{
    const { comboId } = req.query;
    if(!isValidObjectId(comboId)) return res.status(422).json({error: "Invalid combo id!"});
    const combo = await Combo.findOneAndDelete({_id: comboId});
    if(!combo) return res.status(404).json({error: "Combo not found!"});
    res.status(200).json({success: true});
}