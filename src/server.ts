import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import permission from './permission';
import { applyMiddleware } from 'graphql-middleware';
import express from 'express';
import expressJwt from 'express-jwt';
import http from 'http';
import DataLoader from 'dataloader';
import { PORT, JWT_SECRET } from './env';
import * as User from './repositories/user';
import * as Feedback from './repositories/feedback';

export default async function startApolloServer(typeDefs: any, resolvers: any) {
  // Required logic for integrating with Express
  const app = express();
  app.use(
    expressJwt({
      secret: JWT_SECRET,
      algorithms: ["HS256"],
      credentialsRequired: false
    })
  );
  
  const httpServer = http.createServer(app);

  // Same ApolloServer initialization as before, plus the drain plugin.
  const server = new ApolloServer({
    schema: applyMiddleware(
      makeExecutableSchema({ typeDefs, resolvers }),
      permission,
    ),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async({ req }) => {
      const user = req.user || null;
      
      return { 
        user,
        userDataLoader: new DataLoader(async keys => {
          const users = await User.findByIds(keys)
          const userMap: any = {};
          users.forEach(user => {
            userMap[user.id] = user;
          })

          return keys.map((key: any) => userMap[key]);
        }),
        feedbackDataLoader: new DataLoader(async keys => {
          const feedbacks = await Feedback.getFeebacksByReviewId(keys)
          const reviewFeedbacksMap: any = {};
          feedbacks.forEach(feedback => {
            if (!reviewFeedbacksMap[feedback.reviewId]) {
              reviewFeedbacksMap[feedback.reviewId] = [];
            }
            reviewFeedbacksMap[feedback.reviewId].push(feedback);
          })

          return keys.map((key: any) => reviewFeedbacksMap[key]);
        }),
      };
    }
  });

  // More required logic for integrating with Express
  await server.start();
  server.applyMiddleware({ app, path: '/' });

  // Modified server startup
  await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
}