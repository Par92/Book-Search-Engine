//Define the query and mutation functionality to work with the Mongoose models.
const { Book, User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
        return await User.findById(args.id).polulate('user');
    },
  },
  Mutation: {
    addUser: async (parent, {username, email, password}) => {
        const newUser = await User.create({username, email, password});
        const token = signToken(newUser);
        return {token, newUser}; 
    },
    login: async (parent, {email, password}) => {
        const user = await User.findOne({email});

        if (!user) {
            throw new AuthenticationError('No User with the email found!');
        }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
            throw new AuthenticationError('Incorrect password');
        }
        const token = signToken(user);
        return {token, user};
        
    },
    saveBook: async (parent, { book }, context) => {
        return await User.findOneAndUpdate(
            { _id: User._id },
            { $addToSet: { savedBooks: book } },
            { new: true }
      );
    },
    removeBook: async (parent, {bookID}) => {
        return await User.findOneAndUpdate(

        );
    },
  },
};

module.exports = resolvers;