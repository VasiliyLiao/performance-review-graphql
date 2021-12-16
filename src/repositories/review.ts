import { Identifier, Transaction } from 'sequelize/types';
import Review from '../entities/review';

export const getAllReviews = () => 
    Review.findAll();

export const getReviewsByIds = (ids) => 
    Review.findAll({
        where: {
            id: ids,
        }
    });

export const getReview = (id: Identifier) =>
    Review.findByPk(id);

export const deleteReview = async (id: Identifier) => {
    const review = await Review.findByPk(id);
    if (review) {
        await review.destroy();
        return true
    }

    return false;
};

export const updateReviewOwnerByInstance = async (review: Review, ownerId: number, transaction: Transaction|null|undefined) => {
    review.ownerId = ownerId;
    await review.save({ transaction });

    return review;
};
    
export const createReview = (ownerId: number, transaction: Transaction|null|undefined) => 
    Review.create({
        ownerId,
    }, { transaction });
