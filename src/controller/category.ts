import { RequestHandler } from "express";
import Category from '#/models/category';
import { isValidObjectId } from "mongoose";


export const create: RequestHandler = async(req, res) =>{
    const {name} = req.body 
    const category = await Category.create({name});
    res.status(201).json({category});
}

export const update: RequestHandler = async(req, res) =>{
    const { name} = req.body;
    const {catId} = req.params;

    const category = await Category.findByIdAndUpdate( {_id: catId}, { name }, { new: true });
    if(!category) return res.status(404).json({error: "Category not found!"});
    res.status(200).json({category})
}
 
export const removeCategory: RequestHandler = async(req, res) =>{
    const {catId} = req.params;
    if(!isValidObjectId(catId)) return res.status(422).json({error: "Invalid category id!"})
    
        const category = await Category.findOneAndDelete({
            _id: catId
        });
        
        if(!category) return res.status(404).json({error: "Category not found!"})
    
    res.json({success: true});
}

export const allCategory: RequestHandler = async(req, res) =>{
   const category = await Category.find();
   if(!category) return res.status(404).json({error: "No data found!"});
   res.status(200).json({category}); 
}