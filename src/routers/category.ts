import { allCategory, create, removeCategory, update } from "#/controller/category";
import { Router } from "express";

const router = Router();

router.post('/create', create)
router.patch('/:catId', update)
router.get('/all-category', allCategory)
router.delete('/:catId', removeCategory) 

export default router
