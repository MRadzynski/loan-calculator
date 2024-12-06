import { DataTypes, Model, Sequelize } from 'sequelize';

class User extends Model {
  public id!: number;
  public email!: string;
  public type!: 'google' | 'password';

  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        email: {
          allowNull: false,
          type: DataTypes.STRING
        },
        googleId: {
          allowNull: true,
          type: DataTypes.STRING
        },
        type: {
          allowNull: false,
          type: DataTypes.ENUM('google', 'password')
        }
      },
      {
        sequelize,
        tableName: 'User'
      }
    );
  }
}

export default User;
