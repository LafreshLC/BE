var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '#/models/user';
import passwordResetToken from "#/models/passwordResetToken";
import crypto from "crypto";
import { PASSWORD_RESET_LINK } from "#/utils/variables";
import { sendForgetPasswordLink } from "#/utils/mail";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "#/utils/variables";
export const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    const oldUser = yield User.findOne({ email });
    if (oldUser)
        return res.status(403).json({ error: "Email already exist!" });
    const user = yield User.create({ name, email, password });
    res.status(201).json({ user: { id: user._id, name, email } });
});
export const generateForgetPasswordLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield User.findOne({ email });
    if (!user)
        return res.status(404).json({ error: "Account not found!" });
    yield passwordResetToken.findOneAndDelete({
        owner: user._id,
    });
    const token = crypto.randomBytes(36).toString('hex');
    yield passwordResetToken.create({
        owner: user._id,
        token,
    });
    const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;
    sendForgetPasswordLink({ email: user.email, link: resetLink });
    res.json({ message: "Check your registered mail" });
});
export const isValidPasswordResetToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, userId } = req.body;
    const resetToken = yield passwordResetToken.findOne({ owner: userId });
    if (!resetToken)
        return res.status(403).json({ error: "Unauthorized acccess, invalid token" });
    const matched = yield resetToken.compareToken(token);
    if (!matched)
        return res.status(403).json({ error: "Unauthorized acccess, invalid token" });
    res.json({ message: "your token is valid." });
});
export const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, userId } = req.body;
    const user = yield User.findById(userId);
    if (!user)
        return res.status(403).json({ error: "Unathorized access!" });
    const matched = yield user.comparePassword(password);
    if (matched)
        return res.status(422).json({ error: "The new password must be diffrent!" });
    user.password = password;
    yield user.save();
    yield passwordResetToken.findOneAndDelete({ owner: user._id });
    res.json({ message: "Password Reset successfully." });
});
export const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email } = req.body;
    const user = yield User.findOne({
        email,
    });
    if (!user)
        return res.status(403).json({ error: "Email/Password mismatch!" });
    const matched = yield user.comparePassword(password);
    if (!matched)
        return res.status(403).json({ error: "Email/Password mismatch!" });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
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
