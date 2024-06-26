"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const sequelize_1 = require("sequelize");
class Project extends sequelize_1.Model {
}
exports.Project = Project;
exports.default = (sequelize) => {
    Project.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.STRING(5000),
            allowNull: false,
        },
        image_url: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        gif_url: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        video_url: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        programming_language: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        repo_url: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        project_url: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'project',
    });
    return Project;
};
