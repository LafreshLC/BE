import { Router } from "express";
import { addProduct, allProduct, removeProduct, updateProduct } from "#/controller/product";

const router = Router();
router.post('/create-product', addProduct);
router.patch('/:productId', updateProduct);
router.get('/all-product', allProduct);
router.delete('/:productId', removeProduct); 

export default router 