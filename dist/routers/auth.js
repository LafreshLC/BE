"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("#/controller/auth");
const validator_1 = require("#/middleware/validator");
const validationSchema_1 = require("#/utils/validationSchema");
const router = (0, express_1.Router)();
router.post('/create', auth_1.create);
router.post('/forget-password', auth_1.generateForgetPasswordLink);
router.post('/verify-pass-reset-token', (0, validator_1.validate)(validationSchema_1.TokenAndIDValidation), auth_1.isValidPasswordResetToken);
router.post('/update-password', (0, validator_1.validate)(validationSchema_1.UpdatePasswordSchema), auth_1.isValidPasswordResetToken, auth_1.updatePassword);
router.post('/sign-in', (0, validator_1.validate)(validationSchema_1.SignInValidationSchema), auth_1.signIn);
exports.default = router;
