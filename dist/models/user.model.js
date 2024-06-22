"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
}
exports.User = User;
exports.default = (sequelize) => {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'user',
    });
    return User;
};
