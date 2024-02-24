import  Product from "#/models/product";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";


export const addProduct: RequestHandler = async(req, res)=>{
    const {name, category, variant, available, description, price, image} = req.body;
    const product = new Product({
        name, 
        category,
        variant,
        available,
        description,
        price,
        image
    });
    await product.save()
    const [result] = await Product.aggregate([
        {
            $match: {
                _id: product._id,
            },
        },
        {
            $lookup: {
                from: 'categories', // Assuming your Category collection is named 'categories'
                localField: 'category',
                foreignField: '_id',
                as: 'categoryDetails',
            },
        },
        {
            $unwind: '$categoryDetails',
        },
        {
            $replaceRoot: {
                newRoot: {
                    _id: '$categoryDetails._id',
                    product: {
                        _id: product._id,
                        name,
                        variant,
                        available,
                        price,
                        description,
                        image,
                        category: '$categoryDetails.name',
                    },
                },
            },
        },
    ]);

    res.status(201).json({ product: result.product }); 
}

export const updateProduct: RequestHandler = async(req, res)=>{
    const {id, name, category, variant, available, image} = req.body;
    if(!isValidObjectId(id)) return res.status(422).json({error: "Invalid product id!"});
    const product = await Product.findOneAndUpdate({_id: id}, {name, category, variant, available})
    if(!product) return res.status(404).json({error: "Product not found!"});
    await product.save();
    res.status(200).json({ product });
}

export const allProduct: RequestHandler = async(req, res)=>{
    const product = await Product.find();
    if(!product) return res.status(404).json({error: 'No product found!'});
    res.status(200).json({product})  
}

export const removeProduct: RequestHandler = async(req, res)=>{
    const {productId} = req.query;
    if(!isValidObjectId(productId)) return res.status(422).json({error: "Invalid product id!"});
    const product = await Product.findOneAndDelete({_id: productId});
    if(!product) return res.status(404).json({error: 'Product not found!'});  
    res.status(200).json({success: true});
}
