"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureCORS = void 0;
const cors_1 = __importDefault(require("cors"));
/**
 * In app.ts aufrufen:
 * ```
 * configureCORS(app);
 * ```
 * (am besten gleich nach dem Erzeugen der app).
 * Das Paket 'cors' ist bereits installiert.
 */
function configureCORS(app) {
    var _a;
    const corsOptions = {
        origin: (_a = process.env.CORS_ORIGIN) !== null && _a !== void 0 ? _a : "http://localhost:3000",
        methods: "GET,PUT,POST,DELETE",
        allowedHeaders: "Origin,Content-Type",
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        credentials: true
    };
    app.use((0, cors_1.default)(corsOptions));
    app.options('*', (0, cors_1.default)()); // enable pre-flight (request method "options") everywhere, you may want to specify that in detail in production
}
exports.configureCORS = configureCORS;
//# sourceMappingURL=configCORS.js.map