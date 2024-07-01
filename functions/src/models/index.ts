import { Sequelize } from 'sequelize';
import UserModel from './user.model.js';
import RoleModel from './role.model.js';
import RefreshTokenModel from './refreshToken.model.js';
import ProjectModel from './project.model.js';
import ExperienceModel from './experience.model.js';
import config from '../config/db.config.js';

const sequelize = new Sequelize(
    config.DB as string,
    config.USER as string,
    config.PASSWORD as string,
    {
        host: config.HOST,
        dialect: config.dialect as 'postgres',
        dialectOptions: {
            ssl: {
                require: true, 
                rejectUnauthorized: false 
            }
        },
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle,
        },
    }
);

const db: {
    Sequelize: typeof Sequelize;
    sequelize: Sequelize
    User: ReturnType<typeof UserModel>;
    Role: ReturnType<typeof RoleModel>;
    RefreshToken: ReturnType<typeof RefreshTokenModel>;
    Project: ReturnType<typeof ProjectModel>;
    Experience: ReturnType<typeof ExperienceModel>;
    ROLES: string[];

} = {
    Sequelize,
    sequelize,
    User: UserModel(sequelize),
    Role: RoleModel(sequelize),
    RefreshToken: RefreshTokenModel(sequelize),
    Project: ProjectModel(sequelize),
    Experience: ExperienceModel(sequelize),
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

export default db;