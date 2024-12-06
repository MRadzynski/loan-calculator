import { createSequelizeInstance } from '../config/db';
import LoanCalculation from '../models/LoanCalculation';
import ReferenceRate from '../models/ReferenceRate';
import User from '../models/User';

export const checkDatabase = async () => {
  try {
    const sequelize = createSequelizeInstance(false);
    await sequelize.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    );
    await sequelize.close();

    console.log(`Database ${process.env.DB_NAME} is ready.`);

    const sequelizeWithDB = createSequelizeInstance(true);
    await sequelizeWithDB.authenticate();

    ReferenceRate.initModel(sequelizeWithDB);
    User.initModel(sequelizeWithDB);
    LoanCalculation.initModel(sequelizeWithDB);

    await sequelizeWithDB.sync();

    console.log(
      'Connection to the database has been established successfully.'
    );
  } catch (error) {
    console.error('Unable to create the database:', error);
    process.exit(1);
  }
};
