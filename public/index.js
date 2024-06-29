"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const models_1 = __importDefault(require("./_utils/models"));
const auth_routes_1 = __importDefault(require("./_utils/routes/auth.routes"));
const user_routes_1 = __importDefault(require("./_utils/routes/user.routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "https://portfolio-tiagosc.vercel.app",
    preflightContinue: true,
    credentials: true
}));
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
models_1.default.sequelize.sync();
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to tiagosc application' });
});
(0, auth_routes_1.default)(app);
(0, user_routes_1.default)(app);
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
