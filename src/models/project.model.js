"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
var sequelize_1 = require("sequelize");
var Project = /** @class */ (function (_super) {
    __extends(Project, _super);
    function Project() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Project;
}(sequelize_1.Model));
exports.Project = Project;
exports.default = (function (sequelize) {
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
        sequelize: sequelize,
        tableName: 'project',
    });
    return Project;
});
