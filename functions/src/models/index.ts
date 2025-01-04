import { Sequelize } from 'sequelize';
import ProjectModel from './project.model.js';
import ExperienceModel from './experience.model.js';
import config from '../config/db.config.js';
import LeadModel from './lead.model.js';

const sequelize = new Sequelize(
    config.DB as string,
    config.USER as string,
    config.PASSWORD as string,
    {
        host: config.HOST,
        dialect: config.dialect as 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: false,
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
    Project: ReturnType<typeof ProjectModel>;
    Experience: ReturnType<typeof ExperienceModel>;
    Lead: ReturnType<typeof LeadModel>
    ROLES: string[];

} = {
    Sequelize,
    sequelize,
    Project: ProjectModel(sequelize),
    Experience: ExperienceModel(sequelize),
    Lead: LeadModel(sequelize),

    ROLES: ['user', 'admin']
};

export default db;