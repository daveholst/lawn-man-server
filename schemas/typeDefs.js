const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    properties: [Property]
  }

  type Property {
    _id: ID
    propertyName: String
    address: String
    juiceBoxId: String
    openSprinklerAddress: String
    openSprinklerKey: String
    climate: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    addUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): Auth
    login(email: String!, password: String!): Auth
    addProperty(
      propertyName: String
      address: String
      juiceBoxId: String
      openSprinklerAddress: String
      openSprinklerKey: String
      climate: String
    ): User
  }
`;

module.exports = typeDefs;
