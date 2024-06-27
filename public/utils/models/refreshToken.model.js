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
exports.RefreshToken = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
class RefreshToken extends sequelize_1.Model {
    static createToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let expiredAt = new Date();
            expiredAt.setSeconds(expiredAt.getSeconds() + 120);
            let _token = (0, uuid_1.v4)();
            let refreshToken = yield this.create({
                token: _token,
                userId: user.id,
                expiryDate: expiredAt,
            });
            return refreshToken.token;
        });
    }
    static isTokenExpired(token) {
        return token.expiryDate.getTime() < new Date().getTime();
    }
}
exports.RefreshToken = RefreshToken;
exports.default = (sequelize) => {
    RefreshToken.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        token: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        expiryDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        }
    }, {
        sequelize,
        tableName: 'refreshToken'
    });
    return RefreshToken;
};
