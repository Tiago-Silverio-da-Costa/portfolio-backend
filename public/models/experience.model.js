"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Experience = void 0;
const sequelize_1 = require("sequelize");
class Experience extends sequelize_1.Model {
}
exports.Experience = Experience;
exports.default = (sequelize) => {
    Experience.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        company: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.STRING(5000),
            allowNull: false,
        },
        init_time: {
            type: sequelize_1.DataTypes.STRING(25),
            allowNull: false,
        },
        final_time: {
            type: sequelize_1.DataTypes.STRING(25),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'experience',
    });
    return Experience;
};
