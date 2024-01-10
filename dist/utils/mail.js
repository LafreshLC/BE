"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForgetPasswordLink = void 0;
const variables_1 = require("#/utils/variables");
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const template_1 = require("#/mail/template");
const generateMailTransporter = () => {
    const transport = nodemailer_1.default.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: variables_1.MAILTRAP_USER,
            pass: variables_1.MAILTRAP_PASS
        }
    });
    return transport;
};
const sendForgetPasswordLink = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = generateMailTransporter();
    const { email, link } = options;
    const message = "We just recived a request that you forget your password. No problem you can use the link below and create brand new password.";
    transport.sendMail({
        to: email,
        from: variables_1.VERIFICATION_EMAIL,
        subject: "Reset Password Link",
        html: (0, template_1.generateTemplate)({
            title: 'Forget Password',
            message,
            logo: "cid:logo",
            banner: "cid:forget_password",
            link,
            btnTitle: "Reset Password"
        }),
        attachments: [
            {
                filename: "logo.png",
                path: path_1.default.join(__dirname, "../mail/logo.png"),
                cid: "logo"
            },
            {
                filename: "forget_password.png",
                path: path_1.default.join(__dirname, "../mail/forget_password.png"),
                cid: "forget_password"
            },
        ]
    });
});
exports.sendForgetPasswordLink = sendForgetPasswordLink;
