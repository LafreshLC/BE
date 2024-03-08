import { Router } from "express";
import { addProduct, allProduct, removeProduct, updateProduct } from "#/controller/product";

const router = Router();
router.post('/create-product', addProduct);
<<<<<<< HEAD
router.patch('/:productId', updateProduct);
router.get('/all-product', allProduct);
=======
router.post('/update-product', updateProduct);
router.get('/all-product', allProduct); 
>>>>>>> 8521235a2525e1a7d51ef0cb3919a9c978a29f3d
router.delete('/delete-product', removeProduct); 

export default router 