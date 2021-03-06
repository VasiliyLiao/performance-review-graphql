
   
import { gql } from "apollo-server-express";

export default gql `
type User{
    id: ID!
    name: String
    email: String
    role: Int
}

input EmployeeInput {
    name: String
    email: String
    password: String
}

input PerformanceReviewInput {
    writers: [Int!]!
    ownerId: Int
}

type PerformanceReview{
    id: ID!
    owner: User
    feedbacks: [Feedback!]
}

type Feedback {
    id: ID!
    writer: User
    comment: String
}

type Query {
    me: User,

    # employee
    allEmployees: [User!]

    # reviews
    allPerformanceReviews: [PerformanceReview!]
    myNeedWriteReviews: [PerformanceReview!]
}

type Mutation {
     # login
    login(email: String!, password: String!): String

    # employee
    createEmployee(input: EmployeeInput!): User
    updateEmployee(id: ID!, input: EmployeeInput!): User
    deleteEmployee(id: ID!): Int

    # reviews
    createPerformanceReviews(input: PerformanceReviewInput!): Int
    updatePerformanceReviews(id: ID!, input: PerformanceReviewInput!): Int
    deletePerformancereview(id: ID!): Int
    submitFeedback(id: ID!, comment: String): Boolean
}
`