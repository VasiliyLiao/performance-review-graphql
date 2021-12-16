import { rule, shield } from "graphql-shield";
import { AuthenticationError, ApolloError } from 'apollo-server-core';
import { ROLE } from './entities/user';

const isAuthenticated = rule()((parent, args, context) => {
    return context.user !== null;
});

const isAdmin = rule()((parent, args, context) => {
    if (!context.user) {
        return false;
    }

    if (context.user.role === null || context.user.role === undefined ) {
        return false;
    }

    return context.user.role === ROLE.ADMIN;
});

const isEmployee = rule()((parent, args, context) => {
    if (!context.user) {
        return false;
    }
    
    if (context.user.role === null || context.user.role === undefined ) {
        return false;
    }

    return context.user.role === ROLE.EMPLOYEE;
});


export default shield(
    {
        Query: {
            me: isAuthenticated,
            allEmployees: isAdmin,
            allPerformanceReviews: isAdmin,
            myNeedWriteReviews: isEmployee,
        },
        Mutation: {
            createEmployee: isAdmin,
            updateEmployee: isAdmin,
            deleteEmployee: isAdmin,
            createPerformanceReviews: isAdmin,
            updatePerformanceReviews: isAdmin,
            deletePerformancereview: isAdmin,
            submitFeedback: isEmployee,
        },
    }, 
    {
        fallbackError: error => {
            if (!error) {
                return new AuthenticationError('token error')
            }
            if (error instanceof ApolloError) {
                return error;
            }
            if (error instanceof Error) {
                return error;
            }

            return new Error('unknown error');
        }
    }
);