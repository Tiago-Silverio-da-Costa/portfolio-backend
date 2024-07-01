import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.model.js';

interface RefreshTokenAttributes {
    id?: number;
    token: string;
    expiryDate: Date;
    userId?: number;
}

interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id'> { }


export class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
    public id!: number;
    public token!: string;
    public expiryDate!: Date;
    public userId!: number;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static async createToken(user: User): Promise<string> {
        let expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() + 120);

        let _token = uuidv4();

        let refreshToken = await this.create({
            token: _token,
            userId: user.id,
            expiryDate: expiredAt,
        });

        return refreshToken.token;
    }

    public static isTokenExpired(token: RefreshToken): boolean {
        return token.expiryDate.getTime() < new Date().getTime();
    }
}

export default (sequelize: Sequelize): typeof RefreshToken => {
    RefreshToken.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            expiryDate: {
                type: DataTypes.DATE,
                allowNull: false,
            }
        },
        {
            sequelize,
            tableName: 'refreshToken'
        }
    );
    return RefreshToken;
}