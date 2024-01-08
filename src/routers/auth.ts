import { Router } from "express";
import { create, generateForgetPasswordLink, isValidPasswordResetToken, signIn, updatePassword } from "#/controller/auth";
import { validate } from '#/middleware/validator';
import { SignInValidationSchema, TokenAndIDValidation, UpdatePasswordSchema } from "#/utils/validationSchema";

const router = Router();

router.post('/create', create);
router.post('/forget-password', generateForgetPasswordLink);
router.post('/verify-pass-reset-token', validate(TokenAndIDValidation), isValidPasswordResetToken);
router.post('/update-password', validate(UpdatePasswordSchema), isValidPasswordResetToken,  updatePassword);
router.post('/sign-in', validate(SignInValidationSchema), signIn); 




export default router 
