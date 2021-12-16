// eslint-disable-next-line no-undef
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('feedbacks', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            reviewId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'reviews',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            writerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            comment: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
        });
    },

    down: async queryInterface => {
        await queryInterface.dropTable('feedbacks');
    },
};
