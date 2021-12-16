import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { join } from 'path';
import startApolloServer from "./server";
import resolvers from './resolvers';

const schema = loadSchemaSync(join(__dirname, 'schema.graphql'), { loaders: [new GraphQLFileLoader()] });

startApolloServer(schema, resolvers)
    .catch(error => console.error(error));