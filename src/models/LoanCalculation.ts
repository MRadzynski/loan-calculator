import { DataTypes, Model, Sequelize } from 'sequelize';
import ReferenceRate from './ReferenceRate';
import User from './User';

class LoanCalculation extends Model {
  public id!: number;
  public financingAmount!: number;
  public installmentAmount!: number;
  public newInstallmentValue!: number;
  public remainingContractValue!: number;
  public remainingInstallments!: number;
  public totalInstallments!: number;
  public referenceRateId!: number;
  public userId!: number;

  static initModel(sequelize: Sequelize) {
    LoanCalculation.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        financingAmount: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        installmentAmount: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        newInstallmentValue: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        remainingContractValue: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        remainingInstallments: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        totalInstallments: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        referenceRateId: {
          type: DataTypes.INTEGER,
          references: {
            model: ReferenceRate,
            key: 'id'
          }
        },
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: User,
            key: 'id'
          }
        }
      },
      {
        sequelize,
        tableName: 'LoanCalculation'
      }
    );

    LoanCalculation.belongsTo(ReferenceRate, { foreignKey: 'referenceRateId' });
    LoanCalculation.belongsTo(User, { foreignKey: 'userId' });
  }
}

export default LoanCalculation;
