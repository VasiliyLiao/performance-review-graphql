// eslint-disable-next-line no-undef
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
            },
            name: {
                type: Sequelize.STRING,
            },
            hashed_password: {
                type: Sequelize.BLOB,
            },
            salt: {
                type: Sequelize.BLOB,
            },
            role: {
                type: Sequelize.SMALLINT,
                default: 0, // 0: admin, 1: employee
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
        await queryInterface.dropTable('users');
    },
};
