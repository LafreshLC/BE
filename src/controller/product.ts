import Product from "#/models/product";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

export const addProduct: RequestHandler = async (req, res) => {
  const { name, category, description, price, image } = req.body;
  const product = new Product({
    name,
    category,
    description,
    price,
    image,
  });
  await product.save();
  const [result] = await Product.aggregate([
    {
      $match: {
        _id: product._id,
      },
    },
    {
      $lookup: {
        from: "categories", // Assuming your Category collection is named 'categories'
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $unwind: "$categoryDetails",
    },
    {
      $replaceRoot: {
        newRoot: {
          _id: "$categoryDetails._id",
          product: {
            _id: product._id,
            name,
            price,
            description,
            image,
            category: "$categoryDetails.name",
          },
        },
      },
    },
  ]);

  res.status(201).json({ product: result.product });
};

export const updateProduct: RequestHandler = async(req, res)=>{
    const {productId} = req.params;
    const { name, category, description, image} = req.body;
    if(!isValidObjectId(productId)) return res.status(422).json({error: "Invalid product id!"});
    const product = await Product.findOneAndUpdate({_id: productId}, {name, category, description, image})
    if(!product) return res.status(404).json({error: "Product not found!"});
    await product.save();
    res.status(200).json({ product });
}

export const allProduct: RequestHandler = async (req, res) => {
  const { search } = req.query; // Get the search query from request parameters
  let query = {}; // Initialize the query object

  // If search query is provided and it's a string, construct the search criteria
  if (typeof search === "string") {
    const regex = new RegExp(search, "i"); // Case-insensitive regex pattern
    query = {
      $or: [
        { name: { $regex: regex } }, // Search by name
        { description: { $regex: regex } }, // Search by description
      ],
    };
  }

  const products = await Product.find(query);
  if (!products || products.length === 0) {
    return res.status(404).json({ error: "No products found!" });
  }

  const result = await Product.aggregate([
    {
      $match: {
        _id: { $in: products.map((p) => p._id) },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    { $unwind: "$categoryDetails" },
    {
      $replaceRoot: {
        newRoot: {
          _id: "$_id",
          name: "$name",
          description: "$description",
          category: "$categoryDetails.name",
          price: "$price",
          image: "$image",
          status: "$status",
        },
      },
    },
  ]);

  const structuredResponse = {
    products: result.map((product) => ({
      id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      image: product.image,
      status: product.status,
    })),
  };

  res.status(200).json(structuredResponse);
};

export const removeProduct: RequestHandler = async (req, res) => {
  const { productId } = req.params
  const product = await Product.findOneAndDelete({ _id: productId });
  if (!product) return res.status(404).json({ error: "Product not found!" });
  res.status(200).json({ success: true });
};

export const totalNumberOfProduct: RequestHandler = async (req, res) =>{
  const totalProducts = await Product.countDocuments();
  res.json({totalProducts})
}