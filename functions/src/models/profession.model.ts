import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export interface ProfessionAttributes {
    id: number;
    name: string;
}

interface ProfessionCreationAttributes extends Optional<ProfessionAttributes, 'id'> {}

export class Profession extends Model<ProfessionAttributes, ProfessionCreationAttributes> implements ProfessionAttributes{
    public id!: number;
    public name!: string;
}

export default (sequelize: Sequelize): typeof Profession => {
    Profession.init(
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
            modelName: 'profession',
        }
    )

    return Profession
}