"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var user_model_1 = require("./user.model");
var role_model_1 = require("./role.model");
var refreshToken_model_1 = require("./refreshToken.model");
var project_model_1 = require("./project.model");
var experience_model_1 = require("./experience.model");
var db_config_1 = require("../config/db.config");
var sequelize = new sequelize_1.Sequelize(db_config_1.default.DB, db_config_1.default.USER, db_config_1.default.PASSWORD, {
    host: db_config_1.default.HOST,
    dialect: db_config_1.default.dialect,
    pool: {
        max: db_config_1.default.pool.max,
        min: db_config_1.default.pool.min,
        acquire: db_config_1.default.pool.acquire,
        idle: db_config_1.default.pool.idle,
    },
});
var db = {
    Sequelize: sequelize_1.Sequelize,
    sequelize: sequelize,
    User: (0, user_model_1.default)(sequelize),
    Role: (0, role_model_1.default)(sequelize),
    RefreshToken: (0, refreshToken_model_1.default)(sequelize),
    Project: (0, project_model_1.default)(sequelize),
    Experience: (0, experience_model_1.default)(sequelize),
    ROLES: ['user', 'admin']
};
db.Project.belongsTo(db.User, {
    foreignKey: 'userId',
    targetKey: 'id',
});
db.Experience.belongsTo(db.User, {
    foreignKey: 'userId',
    targetKey: 'id',
});
db.Role.belongsToMany(db.User, {
    through: 'user_roles',
    foreignKey: 'roleId',
    otherKey: 'userId',
});
db.User.belongsToMany(db.Role, {
    through: 'user_roles',
    foreignKey: 'userId',
    otherKey: 'roleId',
});
db.RefreshToken.belongsTo(db.User, {
    foreignKey: 'userId',
    targetKey: 'id',
});
db.User.hasOne(db.RefreshToken, {
    foreignKey: 'userId',
    sourceKey: 'id',
});
exports.default = db;
