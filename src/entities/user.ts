import {
    Model,
    Optional,
    DataTypes,
} from 'sequelize';
import sequelize from './_connection';

export enum ROLE {
    ADMIN = 0,
    EMPLOYEE = 1,
}

interface UserAttributes {
    id: number;
    email: string;
    name: string;
    hashed_password: string,
    salt: string,
    role: ROLE,
}
  
type UserCreationAttributes = Optional<UserAttributes, "id">

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public email!: string;
  public name!: string;
  public hashed_password!: string;
  public salt!: string;
  public role!: ROLE;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        hashed_password: {
            type: DataTypes.STRING,
        },
        salt: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.SMALLINT,
        }
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
    },
);

export default User;
