import crypto from 'crypto';
import { Identifier } from 'sequelize/types';
import User, { ROLE } from '../entities/user';
import { 
    getRandomSalt,
    doHashedPassword
} from '../utils/hash';

export const getUser = (id: any) => User.findOne({
    attributes: ['id','name', 'email', 'role'],
    where: {
        id,
    }
});

export const findByIds = (ids: any) => User.findAll({
    where: {
        id: ids
    }
});

export const findUserByEmail = (email: string) => User.findOne({
    where: {
        email,
    },
});

export const getAllEmployees = () => User.findAll({
    where: {
        role: ROLE.EMPLOYEE
    }
}) 

export const createEmployee = async (email: string, name: string, password: crypto.BinaryLike) => {
    const salt = getRandomSalt();
    const hashedPassword = await doHashedPassword(password, salt);
    const user = await User.create({
        email,
        name,
        salt: salt,
        hashed_password: hashedPassword,
        role: ROLE.EMPLOYEE
    });

    return user;
}

export const updateEmployee = async(id: Identifier, email: any, name: any, password: crypto.BinaryLike) => {
    const user = await User.findByPk(id);

    if (user) {
        if (email) {
            user.email = email;
        }
        if (name) {
            user.name = name;
        }
        if (password) {
            const salt = getRandomSalt();
            const hashedPassword = await doHashedPassword(password, salt);
            user.salt = salt;
            user.hashed_password = hashedPassword;
        }

        await user.save();
        return user;
    }

    return null;
};

export const deleteEmployee = async (id: Identifier) => {
    const user = await User.findOne({
        where: {
            id,
            role: ROLE.EMPLOYEE,
        }
    });
    if (user) {
        await user.destroy();
        return true
    }

    return false;
};

export const isPasswordEqualHashed = async (hashedPassword: string, password: string, salt: string) => {
    const currentHashedPassword = await doHashedPassword(password, salt);
    return String(hashedPassword) === currentHashedPassword;
};