const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

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
    editZone: async (_parent, args, context) => {
      // console.log('editZones args: ', args);
      const user = await User.findOneAndUpdate(
        {
          $and: [
            { _id: context.user._id },
            { 'properties.propertyName': args.propertyName },
          ],
        },
        { $set: { 'properties.$.zones': args.input } },
        { new: true, runValidators: true }
      );
      if (!user) {
        throw new AuthenticationError('Could not update zone');
      }
      const token = signToken(user);

      return { token, user };
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
