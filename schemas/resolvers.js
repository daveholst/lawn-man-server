const { AuthenticationError } = require('apollo-server-express');
const { User, Fertiliser } = require('../models');
const { signToken } = require('../utils/auth');
const runManualProgram = require('../utils/runManualProg');

const resolvers = {
  Query: {
    // get my userInfo including books from context
    me: async (_parent, _args, context) => {
      if (context.user) {
        const result = await User.findOne({ _id: context.user._id });
        return result;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    fertilisers: async () => {
      const result = await Fertiliser.find({});
      if (!result) {
        throw new AuthenticationError('You need to be logged in!');
      }
      return result;
    },
  },
  Mutation: {
    addUser: async (_parent, args) => {
      const user = await User.create(args);
      if (!user) {
        throw new AuthenticationError('Could not create user');
      }
      const token = signToken(user);
      return { token, user };
    },
    addProperty: async (_parent, args, context) => {
      const user = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { properties: args } },
        { new: true, runValidators: true }
      );
      if (!user) {
        throw new AuthenticationError('Could not add property to user');
      }
      const token = signToken(user);
      return { token, user };
    },
    addZones: async (_parent, args, context) => {
      // console.log('addZones args: ', args);
      const user = await User.findOneAndUpdate(
        {
          $and: [
            { _id: context.user._id },
            { 'properties.propertyName': args.propertyName },
          ],
        },
        { $addToSet: { 'properties.$.zones': { $each: args.input } } },
        { new: true, runValidators: true }
      );
      if (!user) {
        throw new AuthenticationError('Could not add property to user');
      }
      const token = signToken(user);
      return { token, user };
    },
    addFertiliser: async (_parent, args) => {
      console.log('args: ', args);
      const fertiliser = await Fertiliser.create(args.input);
      console.log('fert: ', fertiliser);
      if (!fertiliser) {
        throw new AuthenticationError('Could not create user');
      }
      return fertiliser;
    },
    editZone: async (_parent, args, context) => {
      const user = await User.findOneAndUpdate(
        {
          _id: context.user._id,
        },
        { $set: { 'properties.$[e1].zones.$[e2]': args.input } },
        {
          arrayFilters: [
            { 'e1.propertyName': args.propertyName },
            { 'e2._id': args.zoneId },
          ],
        }
      );
      if (!user) {
        throw new AuthenticationError('Could not update zone');
      }
      const token = signToken(user);

      return { token, user };
    },
    runManProg: async (_parent, args, context) => {
      const { propertyId, fertRuntime, stationNumber } = args;
      if (context.user) {
        const userResult = await User.findOne({ _id: context.user._id });
        // console.log(userResult);
        console.log(args);
        // get the property info
        const property = userResult.properties.find(
          (el) => el.id === propertyId
        );

        // send it to the run manual programe
        runManualProgram({
          property,
          stationNumber,
          fertRuntime,
        });
        return { message: 'this is a test...' };
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    login: async (_parent, args) => {
      console.log('login mutation fired');
      const user = await User.findOne({
        email: args.email,
      });
      if (!user) {
        throw new AuthenticationError('Could not Find user');
      }
      const correctPw = await user.isCorrectPassword(args.password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect Password');
      }
      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
