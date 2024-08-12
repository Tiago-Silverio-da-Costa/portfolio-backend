import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export interface LeadAttributes {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface LeadCreationAttributes extends Optional<LeadAttributes, "id"> { }

export class Lead extends Model<LeadAttributes, LeadCreationAttributes> implements LeadAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public phone!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize): typeof Lead => {
    Lead.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'lead',
        }
    )

    return Lead
}