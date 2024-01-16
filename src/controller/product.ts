import  Product, {ProductDocument} from "#/models/product";
import { RequestHandler } from "express";
import formidable from "formidable";

// interface AddProductDocument extends RequestWithFiles{
//     body: {
//         title: string;
//         about: string;
//         category: categoriesTypes
//     }

// }

export const addProduct: RequestHandler = async(req, res)=>{
    const newProduct: ProductDocument = req.body;
    const image = req.files?.image as formidable.File;
    if(!newProduct) return res.status(422).json({error: "Product details missing!"})
    const product = await Product.create(newProduct);
    res.status(201).json({ product });
}

export const updateProduct: RequestHandler = async(req, res) =>{
    const {id, name, catId, variant, available} = req.body;
    const product = await Product.findOneAndUpdate({_id:id}, {name, variant, catId, available})
    if(!product) return res.status(404).json({error: "Product not found!"});
    res.status(201).json({product});
}
