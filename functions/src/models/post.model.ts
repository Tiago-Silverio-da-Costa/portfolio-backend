import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export interface PostAttributes {
    id: number;
    title: string;
    subtitle: string;
    content: string;
    image: string;
    themeId?: number;
    authorId?: number;
    professionId?: number;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> { }

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
    public id!: number
    public title!: string;
    public subtitle!: string;
    public content!: string;
    public image!: string;
    public themeId?: number;
    public authorId?: number;
    public professionId?: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize): typeof Post => {
    Post.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            subtitle: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT('long'),  
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            themeId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'themes',
                    key: 'id',
                },
            },
            authorId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            professionId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'professions',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'post',
        }
    )

    return Post
}