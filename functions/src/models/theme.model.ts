import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export interface ThemeAttributes {
    id: number;
    name: string;
}

interface ThemeCreationAttributes extends Optional<ThemeAttributes, 'id'> { }

export class Theme extends Model<ThemeAttributes, ThemeCreationAttributes> implements ThemeAttributes {
    public id!: number;
    public name!: string;
}

export default (sequelize: Sequelize): typeof Theme => {
    Theme.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false, 
            }
        },
        {
            sequelize,
            modelName: 'theme',
        }
    )
    
    return Theme
}