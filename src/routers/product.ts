import { Router } from "express";
import { addProduct, allProduct, removeProduct, updateProduct, totalNumberOfProduct } from "#/controller/product";

const router = Router();
router.post('/create-product', addProduct);
router.patch('/:productId', updateProduct);
router.get('/all-product', allProduct);
router.delete('/:productId', removeProduct); 
router.get('/totalProduct', totalNumberOfProduct)

export default router 