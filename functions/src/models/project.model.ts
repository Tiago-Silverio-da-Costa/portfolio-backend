import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

interface ProjectAttributes {
    id: number;
    name: string;
    description: string;
    image_url: string;
    gif_url: string;
    video_url: string;
    programming_language: string;
    repo_url: string;
    project_url: string;
    language: string;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id'> { }

export class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public image_url!: string;
    public gif_url!: string;
    public video_url!: string;
    public programming_language!: string;
    public repo_url!: string;
    public project_url!: string;
    public language!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize): typeof Project => {
    Project.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(5000),
                allowNull: false,
            },
            image_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            gif_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            video_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            programming_language: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            repo_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            project_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            language: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'project',
        }
    );

    return Project;
};
