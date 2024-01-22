import { create, removeCombo, updateCombo } from "#/controller/combo";
import { Router } from "express";

const router = Router();

router.post('/create-combo', create)
router.patch('/update/:comboId', updateCombo);
router.delete('/remove-combo', removeCombo);

export default router;