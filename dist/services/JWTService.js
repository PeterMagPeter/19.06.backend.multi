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
exports.verifyJWT = exports.verifyPasswordAndCreateJWT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // read ".env"
const jsonwebtoken_1 = require("jsonwebtoken");
const AuthenticationService_1 = require("./AuthenticationService");
function verifyPasswordAndCreateJWT(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const secret = process.env.JWT_SECRET;
        const ttl = parseInt(process.env.JWT_TTL);
        if (!secret || !ttl)
            throw new Error("Jwt secret or TTL are not defined.");
        const logged = yield (0, AuthenticationService_1.login)(email, password);
        let jwtString = undefined;
        if (logged) {
            const payload = {
                sub: logged === null || logged === void 0 ? void 0 : logged.id
            };
            jwtString = (0, jsonwebtoken_1.sign)(payload, secret, {
                expiresIn: ttl,
                algorithm: "HS256"
            });
        }
        return jwtString;
    });
}
exports.verifyPasswordAndCreateJWT = verifyPasswordAndCreateJWT;
function verifyJWT(jwtString) {
    const secret = process.env.JWT_SECRET;
    if (jwtString && secret) {
        const payload = (0, jsonwebtoken_1.verify)(jwtString, secret);
        if (payload) {
            return Object.assign(Object.assign({}, payload), { id: payload.sub.toString() });
        }
        else
            throw new jsonwebtoken_1.JsonWebTokenError("JWTString incorrect.");
    }
    else {
        throw new Error("JWTString or secret are not defined.");
    }
}
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=JWTService.js.map