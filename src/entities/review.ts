import {
    Model,
    Optional,
    DataTypes,
} from 'sequelize';
import sequelize from './_connection';

interface ReviewAttributes {
    id: number;
    ownerId: number;
}
  
type ReviewCreationAttributes = Optional<ReviewAttributes, "id">

class Review extends Model<ReviewAttributes, ReviewCreationAttributes>
  implements ReviewAttributes {
  public id!: number;
  public ownerId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Review.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ownerId: {
            type: DataTypes.INTEGER,
        },
    },
    {
        sequelize,
        modelName: 'Review',
        tableName: 'reviews',
    },
);

export default Review;
