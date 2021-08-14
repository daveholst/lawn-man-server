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

  type Fertiliser {
    _id: ID
    productBrand: String
    productName: String
    type: String
    description: String
    applicationRate: String
    manufacturerLink: String
    bunningsLink: String
    imageLink: String
  }
  input CreateFertiliserPayload {
    productBrand: String!
    productName: String!
    type: String
    description: String
    applicationRate: String
    manufacturerLink: String
    bunningsLink: String
    imageLink: String
  }

  input RunManualPayload {
    propertyId: String!
    fertRunTime: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    fertilisers: [Fertiliser]
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
    editZone(
      zoneId: String!
      propertyName: String!
      input: [CreateZonePayload]
    ): Auth
    addFertiliser(input: CreateFertiliserPayload): Fertiliser
    runManProg(input: RunManualPayload!): String
  }
`;

module.exports = typeDefs;
