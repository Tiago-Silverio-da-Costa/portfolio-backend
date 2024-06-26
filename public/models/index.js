"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("./user.model"));
const role_model_1 = __importDefault(require("./role.model"));
const refreshToken_model_1 = __importDefault(require("./refreshToken.model"));
const project_model_1 = __importDefault(require("./project.model"));
const experience_model_1 = __importDefault(require("./experience.model"));
const db_config_1 = __importDefault(require("../config/db.config"));
const sequelize = new sequelize_1.Sequelize(db_config_1.default.DB, db_config_1.default.USER, db_config_1.default.PASSWORD, {
    host: db_config_1.default.HOST,
    dialect: db_config_1.default.dialect,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    pool: {
        max: db_config_1.default.pool.max,
        min: db_config_1.default.pool.min,
        acquire: db_config_1.default.pool.acquire,
        idle: db_config_1.default.pool.idle,
    },
});
const db = {
    Sequelize: sequelize_1.Sequelize,
    sequelize,
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
