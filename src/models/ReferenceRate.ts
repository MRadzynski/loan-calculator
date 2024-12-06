import { DataTypes, Model, Sequelize } from 'sequelize';

class ReferenceRate extends Model {
  public id!: number;
  public fetchedAt!: Date;
  public rate!: number;

  static initModel(sequelize: Sequelize) {
    ReferenceRate.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        fetchedAt: {
          defaultValue: DataTypes.NOW,
          type: DataTypes.DATE
        },
        rate: {
          type: DataTypes.FLOAT,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'ReferenceRate'
      }
    );
  }
}

export default ReferenceRate;
