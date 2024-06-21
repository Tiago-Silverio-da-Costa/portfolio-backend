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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.signin = exports.signup = exports.LoginSchema = void 0;
var models_1 = require("../models");
var auth_config_1 = require("../config/auth.config");
var sequelize_1 = require("sequelize");
var zod_1 = require("zod");
var validator_1 = require("validator");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var User = models_1.default.User, Role = models_1.default.Role, RefreshToken = models_1.default.RefreshToken;
exports.LoginSchema = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().refine(validator_1.isEmail, { message: "Invalid email" }),
    password: zod_1.z.string().refine(validator_1.isStrongPassword, { message: "Password is too weak" }),
    roles: zod_1.z.string(),
});
var signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, roles, existingUser, hashedPassword, newUser, userRoles, defaultRole, error_1, err;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, username = _a.username, email = _a.email, password = _a.password, roles = _a.roles;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 11, , 12]);
                return [4 /*yield*/, User.findOne({
                        where: (_b = {},
                            _b[sequelize_1.Op.or] = [{ username: username }, { email: email }],
                            _b),
                    })];
            case 2:
                existingUser = _c.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(400).json({ message: "Username or Email already exists!" })];
                }
                return [4 /*yield*/, bcrypt.hash(password, 8)];
            case 3:
                hashedPassword = _c.sent();
                return [4 /*yield*/, User.create({
                        username: username,
                        email: email,
                        password: hashedPassword,
                    })];
            case 4:
                newUser = _c.sent();
                if (!(roles && roles.length > 0)) return [3 /*break*/, 7];
                return [4 /*yield*/, Role.findAll({
                        where: {
                            name: roles,
                        },
                    })];
            case 5:
                userRoles = _c.sent();
                return [4 /*yield*/, newUser.set('roles', userRoles)];
            case 6:
                _c.sent();
                return [3 /*break*/, 10];
            case 7: return [4 /*yield*/, Role.findOne({ where: { name: 'user' } })];
            case 8:
                defaultRole = _c.sent();
                if (!defaultRole) return [3 /*break*/, 10];
                return [4 /*yield*/, newUser.set('roles', [defaultRole])];
            case 9:
                _c.sent();
                _c.label = 10;
            case 10:
                res.status(201).json({ message: "User was registered successfully!" });
                return [3 /*break*/, 12];
            case 11:
                error_1 = _c.sent();
                err = error_1;
                res.status(500).json({ message: err.message || "Some error occurred while signing up." });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var signin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, user, passwordIsValid, token, authorities, error_2, err;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, User.findOne({
                        where: { username: username },
                        include: Role,
                    })];
            case 2:
                user = _c.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: "User Not found." })];
                }
                passwordIsValid = bcrypt.compareSync(password, user.password);
                if (!passwordIsValid) {
                    return [2 /*return*/, res.status(401).json({
                            accessToken: null,
                            message: "Invalid Password!",
                        })];
                }
                token = jwt.sign({ id: user.id }, auth_config_1.default.secret, {
                    expiresIn: auth_config_1.default.jwtExpiration,
                });
                authorities = ((_b = user.roles) === null || _b === void 0 ? void 0 : _b.map(function (role) { return "ROLE_".concat(role.name.toUpperCase()); })) || [];
                res.status(200).json({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token,
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _c.sent();
                err = error_2;
                res.status(500).json({ message: err.message || "Some error occurred while signing in." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.signin = signin;
var refreshToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var requestToken, refreshTokenInstance, user, accessToken, error_3, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestToken = req.body.refreshToken;
                if (!requestToken) {
                    return [2 /*return*/, res.status(403).json({ message: "Refresh Token is required!" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, RefreshToken.findOne({ where: { token: requestToken } })];
            case 2:
                refreshTokenInstance = _a.sent();
                if (!refreshTokenInstance) {
                    return [2 /*return*/, res.status(403).json({ message: "Refresh token is not valid or expired!" })];
                }
                if (!RefreshToken.isTokenExpired(refreshTokenInstance)) return [3 /*break*/, 4];
                return [4 /*yield*/, refreshTokenInstance.destroy()];
            case 3:
                _a.sent();
                return [2 /*return*/, res.status(403).json({ message: "Refresh token is expired. Please make a new signin request." })];
            case 4: return [4 /*yield*/, User.findByPk(refreshTokenInstance.userId)];
            case 5:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: "User not found." })];
                }
                accessToken = jwt.sign({ id: user.id }, auth_config_1.default.secret, {
                    expiresIn: auth_config_1.default.jwtExpiration,
                });
                // Respond with new access token and existing refresh token
                res.status(200).json({ accessToken: accessToken, refreshToken: refreshTokenInstance.token });
                return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                err = error_3;
                res.status(500).json({ message: err.message || "Some error occurred while refreshing token." });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.refreshToken = refreshToken;
