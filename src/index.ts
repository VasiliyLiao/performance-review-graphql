import startApolloServer from "./server";
import resolvers from './resolvers';
import typeDefs from './typeDef';

startApolloServer(typeDefs, resolvers)
    .catch(error => console.error(error));