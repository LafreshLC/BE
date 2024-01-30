import { allCategory, create, removeCategory, update } from "#/controller/category";
import { Router } from "express";

const router = Router();

router.post('/create', create)
router.post('/update', update)
router.get('/all-category', allCategory)
router.delete('/delete', removeCategory)

export default router
