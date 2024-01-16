import { Router } from "express";
import { addProduct, updateProduct } from "#/controller/product";
import fileParser from "#/middleware/filePerser";

const router = Router();
router.post('/create-product', addProduct);
router.post('/update-product', fileParser, updateProduct);

export default router 