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
    zones: [Zone]
  }

  type Zone {
    _id: ID
    stationNumber: String!
    stationName: String!
    type: String
    area: String
  }
  input CreateZonePayload {
    stationNumber: String!
    stationName: String!
    type: String
    area: String
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
    ): Auth
    addZones(propertyName: String!, input: [CreateZonePayload]): Auth
    editZone(ZoneId: ID!, input: [CreateZonePayload]): Zone
  }
`;

module.exports = typeDefs;
