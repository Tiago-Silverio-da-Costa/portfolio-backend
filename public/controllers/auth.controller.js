"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.refreshToken = exports.signin = exports.signup = exports.LoginSchema = void 0;
const models_1 = __importDefault(require("../models"));
const auth_config_1 = __importDefault(require("../config/auth.config"));
const sequelize_1 = require("sequelize");
const zod_1 = require("zod");
const validator_1 = require("validator");
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcryptjs"));
const { User, Role, RefreshToken } = models_1.default;
exports.LoginSchema = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().refine(validator_1.isEmail, { message: "Invalid email" }),
    password: zod_1.z.string().refine(validator_1.isStrongPassword, { message: "Password is too weak" }),
    roles: zod_1.z.string(),
});
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, roles } = req.body;
    try {
        // Check if username or email already exists
        const existingUser = yield User.findOne({
            where: {
                [sequelize_1.Op.or]: [{ username }, { email }],
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: "Username or Email already exists!" });
        }
        // Hash password
        const hashedPassword = yield bcrypt.hash(password, 8);
        // Create User
        const newUser = yield User.create({
            username,
            email,
            password: hashedPassword,
        });
        // Assign roles if provided
        if (roles && roles.length > 0) {
            const userRoles = yield Role.findAll({
                where: {
                    name: roles,
                },
            });
            yield newUser.set('roles', userRoles);
        }
        else {
            const defaultRole = yield Role.findOne({ where: { name: 'user' } });
            if (defaultRole) {
                yield newUser.set('roles', [defaultRole]);
            }
        }
        res.status(201).json({ message: "User was registered successfully!" });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: err.message || "Some error occurred while signing up." });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { username, password } = req.body;
    try {
        const user = yield User.findOne({
            where: { username },
            include: Role,
        });
        if (!user) {
            return res.status(404).json({ message: "User Not found." });
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: "Invalid Password!",
            });
        }
        const token = jwt.sign({ id: user.id }, auth_config_1.default.secret, {
            expiresIn: auth_config_1.default.jwtExpiration,
        });
        const authorities = ((_a = user.roles) === null || _a === void 0 ? void 0 : _a.map(role => `ROLE_${role.name.toUpperCase()}`)) || [];
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: err.message || "Some error occurred while signing in." });
    }
});
exports.signin = signin;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken: requestToken } = req.body;
    if (!requestToken) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }
    try {
        // Find refresh token in database
        const refreshTokenInstance = yield RefreshToken.findOne({ where: { token: requestToken } });
        if (!refreshTokenInstance) {
            return res.status(403).json({ message: "Refresh token is not valid or expired!" });
        }
        // Verify if the refresh token is expired
        if (RefreshToken.isTokenExpired(refreshTokenInstance)) {
            yield refreshTokenInstance.destroy();
            return res.status(403).json({ message: "Refresh token is expired. Please make a new signin request." });
        }
        // Find user associated with the refresh token
        const user = yield User.findByPk(refreshTokenInstance.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        // Generate new access token
        const accessToken = jwt.sign({ id: user.id }, auth_config_1.default.secret, {
            expiresIn: auth_config_1.default.jwtExpiration,
        });
        // Respond with new access token and existing refresh token
        res.status(200).json({ accessToken, refreshToken: refreshTokenInstance.token });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: err.message || "Some error occurred while refreshing token." });
    }
});
exports.refreshToken = refreshToken;
