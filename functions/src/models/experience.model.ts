import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

interface ExperienceAttributes {
    id: number;
    company: string;
    description: string;
    init_time: string;
    final_time: string;
    language: string;
}

interface ExperienceCreationAttributes extends Optional<ExperienceAttributes, 'id'> { }

export class Experience extends Model<ExperienceAttributes, ExperienceCreationAttributes> implements ExperienceAttributes {
    public id!: number;
    public company!: string;
    public description!: string;
    public init_time!: string;
    public final_time!: string;
    public language!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize): typeof Experience => {
    Experience.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            company: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(10000),
                allowNull: false,
            },
            init_time: {
                type: DataTypes.STRING(25),
                allowNull: false,
            },
            final_time: {
                type: DataTypes.STRING(25),
                allowNull: false,
            },
            language: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'experience',
        }
    );

    return Experience;
};
