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
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const UserModel_1 = require("../model/UserModel");
/**
 * Checks name and password. If successful, true is returned, otherwise false
 */
function login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield UserModel_1.User.findOne({ email: email }).exec();
        const pwValid = yield (user === null || user === void 0 ? void 0 : user.isCorrectPassword(password));
        if (!user || !pwValid)
            return false;
        else
            return { id: user === null || user === void 0 ? void 0 : user.id };
    });
}
exports.login = login;
//# sourceMappingURL=AuthenticationService.js.map