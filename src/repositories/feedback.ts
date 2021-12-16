import { Identifier, Transaction } from 'sequelize/types';
import Feedback from '../entities/feedback';

export const getFeedback = (id: Identifier) =>
    Feedback.findByPk(id);

export const getFeebacksByReviewId = (reviewIds: any) => 
    Feedback.findAll({
        where: {
            reviewId: reviewIds,
        }
    });

export const deleteManyFeedbacks = (ids: Identifier[], transaction: Transaction|null|undefined) => 
    Feedback.destroy({
        where: {
            id: ids
        },
        transaction
    });

export const createManyInitFeedbacks = async (reviewId: number, writerIds: number[], transaction: Transaction|null|undefined) => {
    const feedbacks = writerIds.map((writerId)=> ({
        writerId,
        reviewId,
        comment: null,
    }));
    await Feedback.bulkCreate(feedbacks, { transaction });
}

export const updateCommenctByInstance = async (feedback: Feedback, comment: string) => {
    feedback.comment = comment;
    await feedback.save();

    return feedback;
}
    