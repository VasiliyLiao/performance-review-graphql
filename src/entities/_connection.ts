import { Sequelize } from 'sequelize';
import { 
    NODE_ENV,
    DB_DATABASE,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
} from '../env';

const getSequelize = () => {
    if (NODE_ENV === 'production') {
        return new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
            dialect: 'postgres',
            host: DB_HOST,
            port: DB_PORT,
            dialectOptions: {
                ssl: {
                    rejectUnauthorized: false,
                }
            },
            define: {
                paranoid: false,
                freezeTableName: false,
                charset: 'utf8',
            },
        })
    }

    return new Sequelize({
        dialect: 'sqlite',
        storage: 'database.sqlite',
        define: {
            charset: 'utf8',
        }
    });
};

export default getSequelize();