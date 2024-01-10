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
exports.signIn = exports.updatePassword = exports.isValidPasswordResetToken = exports.generateForgetPasswordLink = exports.create = void 0;
const user_1 = __importDefault(require("#/models/user"));
const passwordResetToken_1 = __importDefault(require("#/models/passwordResetToken"));
const crypto_1 = __importDefault(require("crypto"));
const variables_1 = require("#/utils/variables");
const mail_1 = require("#/utils/mail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const variables_2 = require("#/utils/variables");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    const oldUser = yield user_1.default.findOne({ email });
    if (oldUser)
        return res.status(403).json({ error: "Email already exist!" });
    const user = yield user_1.default.create({ name, email, password });
    res.status(201).json({ user: { id: user._id, name, email } });
});
exports.create = create;
const generateForgetPasswordLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_1.default.findOne({ email });
    if (!user)
        return res.status(404).json({ error: "Account not found!" });
    yield passwordResetToken_1.default.findOneAndDelete({
        owner: user._id,
    });
    const token = crypto_1.default.randomBytes(36).toString('hex');
    yield passwordResetToken_1.default.create({
        owner: user._id,
        token,
    });
    const resetLink = `${variables_1.PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;
    (0, mail_1.sendForgetPasswordLink)({ email: user.email, link: resetLink });
    res.json({ message: "Check your registered mail" });
});
exports.generateForgetPasswordLink = generateForgetPasswordLink;
const isValidPasswordResetToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, userId } = req.body;
    const resetToken = yield passwordResetToken_1.default.findOne({ owner: userId });
    if (!resetToken)
        return res.status(403).json({ error: "Unauthorized acccess, invalid token" });
    const matched = yield resetToken.compareToken(token);
    if (!matched)
        return res.status(403).json({ error: "Unauthorized acccess, invalid token" });
    res.json({ message: "your token is valid." });
});
exports.isValidPasswordResetToken = isValidPasswordResetToken;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, userId } = req.body;
    const user = yield user_1.default.findById(userId);
    if (!user)
        return res.status(403).json({ error: "Unathorized access!" });
    const matched = yield user.comparePassword(password);
    if (matched)
        return res.status(422).json({ error: "The new password must be diffrent!" });
    user.password = password;
    yield user.save();
    yield passwordResetToken_1.default.findOneAndDelete({ owner: user._id });
    res.json({ message: "Password Reset successfully." });
});
exports.updatePassword = updatePassword;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email } = req.body;
    const user = yield user_1.default.findOne({
        email,
    });
    if (!user)
        return res.status(403).json({ error: "Email/Password mismatch!" });
    const matched = yield user.comparePassword(password);
    if (!matched)
        return res.status(403).json({ error: "Email/Password mismatch!" });
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, variables_2.JWT_SECRET);
    user.tokens.push(token);
    yield user.save();
    res.json({
        profile: {
            id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
        },
        token,
    });
});
exports.signIn = signIn;
