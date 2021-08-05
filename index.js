const express = require('express');
// bring apollo server in
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

const { typeDefs, resolvers } = require('./schemas');
// bring in auth middleware for context
const { authMiddleware } = require('./utils/auth');

const db = require('./config/dbConfig');

const PORT = process.env.PORT || 3001;
const app = express();

// ! had to do this due to some weird issue in v3 of

const apolloServer = (async function startApolloServer() {
  //   // create apollo server
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  await apollo.start();

  apollo.applyMiddleware({ app });

  return apollo;
})();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // TODO apolloserver not resovled by this point, should prob fix :/
    console
      .log
      // `Use GraphQL at http://localhost:${PORT}${apolloServer.graphqlPath}`
      ();
  });
});
