import { Sequelize } from 'sequelize';

export const createSequelizeInstance = (withDatabase: boolean = true) => {
  const database = withDatabase ? (process.env.DB_NAME as string) : '';

  return new Sequelize(
    database,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD,
    {
      dialect: 'mysql',
      host: process.env.DB_HOST || 'db',
      logging: false,
      port: Number(process.env.DB_PORT) || 3306
    }
  );
};

const sequelize = createSequelizeInstance(true);

export default sequelize;
