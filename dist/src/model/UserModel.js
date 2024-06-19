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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
;
;
// User schema
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    points: { type: Number, default: 0 },
    //picture: {type: String, default: ""},     NICE TO HAVE
    premium: { type: Boolean, default: false },
    level: { type: Number, default: 1 },
    gameSound: { type: Boolean, default: true },
    music: { type: Boolean, default: true },
    higherLvlChallenge: { type: Boolean, default: false }
});
userSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            const hashedPassword = yield bcryptjs_1.default.hash(this.password, 10);
            this.password = hashedPassword;
        }
    });
});
userSchema.pre(["updateOne", "findOneAndUpdate", "updateMany"], function () {
    return __awaiter(this, void 0, void 0, function* () {
        const update = this.getUpdate();
        if (update && "password" in update) {
            const hashedPassword = yield bcryptjs_1.default.hash(update.password, 10);
            update.password = hashedPassword;
        }
    });
});
userSchema.method("isCorrectPassword", function (toCheck) {
    if (this.isModified("password")) {
        throw new Error("Error! Can't compare password, some updates aren't yet saved.");
    }
    const isCorrect = bcryptjs_1.default.compare(toCheck, this.password);
    return isCorrect;
});
exports.User = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=UserModel.js.map