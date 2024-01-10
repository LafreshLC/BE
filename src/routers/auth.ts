import { Router } from "express";
import { create, generateForgetPasswordLink, grantValid, logout, sendProfile, signIn, updatePassword } from "#/controller/auth";
import { validate } from '#/middleware/validator';
import { CreateUserSchema, SignInValidationSchema, TokenAndIDValidation, UpdatePasswordSchema } from "#/utils/validationSchema";
import { isValidPasswordResetToken, mustAuth } from "#/middleware/auth";

const router = Router();

router.post('/create', validate(CreateUserSchema), create);
router.post('/forget-password', generateForgetPasswordLink);
router.post('/verify-pass-reset-token', validate(TokenAndIDValidation), isValidPasswordResetToken, grantValid);
router.post('/update-password', validate(UpdatePasswordSchema), isValidPasswordResetToken, updatePassword);
router.post('/sign-in', validate(SignInValidationSchema), signIn); 
router.get('/is-auth', mustAuth, sendProfile)  
router.post('/log-out', mustAuth, logout)




export default router 
