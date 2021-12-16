import jwt from 'jsonwebtoken';
import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { JWT_SECRET } from '../env';
import sequelize from '../entities/_connection';
import * as UserRepo from '../repositories/user';
import * as ReviewRepo from '../repositories/review';
import * as FeedbackRepo from '../repositories/feedback';

const PerformanceReview = {
    feedbacks(parent: any, args: any, context: any) {
        return context.feedbackDataLoader.load(parent.id);
    },
    owner(parent: any, args: any, context: any) {
        return context.userDataLoader.load(parent.ownerId);
    }
};

const Feedback = {
    writer(parent: any, args: any, context: any) {
        return context.userDataLoader.load(parent.writerId);
    }
}

const Query = {
    me: (parentValue: any, args: any, context: any) => {
        return UserRepo.getUser(context.user.subject);
    },
    async allEmployees() {
        const employees = await UserRepo.getAllEmployees();
        return employees;
    },
    async allPerformanceReviews() {
        const reviews = await ReviewRepo.getAllReviews();
        return reviews;
    },
    async myNeedWriteReviews(parent: any, args: any, context: any) {
        const userId = context.user.subject;
        const feedbacks = await FeedbackRepo.getUnCommentFeebacksByWriterId(userId);
        const reviewIds = feedbacks.map(feedback => feedback.reviewId);
        if (!reviewIds.length) {
            return [];
        }

        const reviews = await ReviewRepo.getReviewsByIds(reviewIds)
        return reviews;
    },
};

const Mutation = {
    async login(parent: any, args: any) {
        const {
            email,
            password,
        } = args
        
        const user = await UserRepo.findUserByEmail(email);
        if (!user) {
            return new AuthenticationError('Incorrect email or password.')
        }

        const isPasswordValidate = await UserRepo.isPasswordEqualHashed(user.hashed_password, password, user.salt);
    
        if (!isPasswordValidate) {
            return new AuthenticationError('Incorrect email or password.')
        }

        const token = jwt.sign({ subject: user.id, role: user.role }, JWT_SECRET, {
            algorithm:'HS256', 
            expiresIn: '1h'
        });

        return token;
    },

    async createEmployee(parent: any, args: any){
        const {
            email,
            name,
            password
        } = args.input;

        const user = await UserRepo.createEmployee(email, name, password);
        return user;
    },
    async updateEmployee(parent: any, args: any) {
        const {
            id,
            input: {
                email,
                name,
                password
            },
        } = args;

        const user = await UserRepo.updateEmployee(id, email, name, password);
        if (!user) {
            return new UserInputError('not found the user');
        }

        return user;
    },
    async deleteEmployee(parent: any, args: any) {
        const {
            id,
        } = args;

        const isRemoveSuccess = await UserRepo.deleteEmployee(id);
        if (!isRemoveSuccess) {
            return new UserInputError('not found the user');
        }

        return id;
    },

    // performanceReviews
    async createPerformanceReviews(parent: any, args: any) {
        const {
            writers,
            ownerId,
        } = args.input;
        const allValidateUserIds = [...writers, ownerId];
        const users = await UserRepo.findByIds(allValidateUserIds);
        if (users.length !== allValidateUserIds.length) {
            return new UserInputError('has the user not found');
        }

        let reviewId = null;
        await sequelize.transaction(async(t) => {
            const review = await ReviewRepo.createReview(ownerId, t);
            await FeedbackRepo.createManyInitFeedbacks(review.id, writers, t);
            reviewId = review.id;
        });

        return reviewId;
    },

    async updatePerformanceReviews(parent: any, args: any) {
        const {
            id,
            input: {
                ownerId,
                writers = [],
            },
        } = args;

        const review = await ReviewRepo.getReview(id);
        let feedbacks = [];
        if (!review) {
            return new UserInputError('not found the review');
        }
        const removesMap = new Map;
        const creates: number[] = [];
        if (writers && writers.length) {
            feedbacks = await FeedbackRepo.getFeebacksByReviewId([review.id]);
            feedbacks.forEach(feedback => {
                removesMap.set(feedback.writerId, feedback.id)
            });
            writers.forEach((writerId: number)=> {
                if (removesMap.get(writerId)) {
                    // no create and no remove
                    removesMap.delete(writerId);
                } else {
                    // must create
                    creates.push(writerId);
                }
            })
        }
        const removes = Array.from(removesMap.values());

        await sequelize.transaction(async(t) => {
            if (ownerId && ownerId !== review.ownerId) {
                await ReviewRepo.updateReviewOwnerByInstance(review, ownerId, t);
            }
            if (removes.length) {
                await FeedbackRepo.deleteManyFeedbacks(removes, t);
            }
            if (creates.length) {
                await FeedbackRepo.createManyInitFeedbacks(review.id, creates, t)
            }
        });

        return id;
    },

    async deletePerformancereview(parent: any, args: any) {
        const {
            id,
        } = args;

        const isRemoveSuccess = await ReviewRepo.deleteReview(id);
        if (!isRemoveSuccess) {
            return new UserInputError('not found the review');
        }

        return id;
    },


    async submitFeedback(parent: any, args: any, context) {
        const {
            id,
            comment
        } = args;

        const feedback = await FeedbackRepo.getFeedback(id);
        if (!feedback) {
            return new UserInputError('not found the feedback');
        }
        if (feedback.writerId != context.user.subject) {
            return new UserInputError('not found the feedback');
        }

        await FeedbackRepo.updateCommenctByInstance(feedback, comment);
        return true;
    },

}

export default {
    PerformanceReview,
    Feedback,
    Query,
    Mutation,
};