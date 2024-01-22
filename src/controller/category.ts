import { RequestHandler } from "express";
import Category from '#/models/category';
import { isValidObjectId } from "mongoose";


export const create: RequestHandler = async(req, res) =>{
    const {name} = req.body 
    const category = await Category.create({name});
    res.status(201).json({category: category._id, name});
}

export const update: RequestHandler = async(req, res) =>{
    const {id, name} = req.body;

    const category = await Category.findByIdAndUpdate( {_id: id}, { name }, { new: true });
    if(!category) return res.status(404).json({error: "Category not found!"});
    res.status(200).json({category})
}
 
export const removeCategory: RequestHandler = async(req, res) =>{
    const {catId, all} = req.query;
    if(!isValidObjectId(catId)) return res.status(422).json({error: "Invalid category id!"})
    if(all === 'yes'){
        const category = await Category.findOneAndDelete({
            _id: catId
        })
        if(!category) return res.status(404).json({error: "Category not found!"})
    }
    res.json({success: true});
}

export const allCategory: RequestHandler = async(req, res) =>{
    
}