import {
    Model,
    Optional,
    DataTypes,
} from 'sequelize';
import sequelize from './_connection';

interface FeedbackAttributes {
    id: number;
    reviewId: number;
    writerId: number;
    comment: string | null;
}
  
type FeedbackAttributesCreationAttributes = Optional<FeedbackAttributes, "id">

class Feedback extends Model<FeedbackAttributes, FeedbackAttributesCreationAttributes>
  implements FeedbackAttributes {
  public id!: number;
  public reviewId!: number;
  public writerId!: number;
  public comment!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Feedback.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        reviewId: {
            type: DataTypes.INTEGER,
        },
        writerId: {
            type: DataTypes.STRING,
        },
        comment: {
            type: DataTypes.STRING,
        }
    },
    {
        sequelize,
        modelName: 'Feedback',
        tableName: 'feedbacks',
    },
);

export default Feedback;
