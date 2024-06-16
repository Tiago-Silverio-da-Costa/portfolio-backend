import { Sequelize } from 'sequelize';
import UserModel from './user.model';
import RoleModel from './role.model';
import RefreshTokenModel from './refreshToken.model';
import config from '../config/db.config';

const sequelize = new Sequelize(
    config.DB as string,
    config.USER as string,
    config.PASSWORD as string,
    {
      host: config.HOST,
      dialect: config.dialect as 'postgres',    
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
    ROLES: string[];
} = {
    Sequelize,
    sequelize,
    User: UserModel(sequelize),
    Role: RoleModel(sequelize),
    RefreshToken: RefreshTokenModel(sequelize),
    ROLES: ['user', 'admin']
};


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