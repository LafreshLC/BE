var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as yup from "yup";
export const validate = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body)
            return res.status(422).json({ error: "Empty body is not acepted" });
        const { name, email, password } = req.body;
        const schemaToValidate = yup.object({
            body: schema
        });
        try {
            yield schemaToValidate.validate({
                body: req.body
            }, {
                abortEarly: true
            });
            next();
        }
        catch (error) {
            if (error instanceof yup.ValidationError) {
                res.status(422).json({ error: error.message });
            }
        }
    });
};
